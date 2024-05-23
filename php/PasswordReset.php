<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header('Content-Type: application/json');
    require '/var/www/html/phpMailer/Exception.php';
    require '/var/www/html/phpMailer/PHPMailer.php';
    require '/var/www/html/phpMailer/SMTP.php';

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    function sendPasswordResetEmail($email, $newPassword) {
        // PHPMailer 객체 생성
        $mail = new PHPMailer(true);
      
        try {
          // SMTP 설정
          $mail->isSMTP();
          $mail->Host = 'smtp.gmail.com';
          $mail->SMTPAuth = true;
          $mail->Username = 'pjw90581324@gmail.com';
          $mail->Password = 'wesmfxsijagsarqb';
          $mail->SMTPSecure = 'ssl';
          $mail->Port = 465;
          $mail->SMTPKeepAlive = true;
          $mail->CharSet = "utf-8";
          // 이메일 설정
          $mail->setFrom('pjw90581324@gmail.com');
          $mail->addAddress($email);
          $mail->isHTML(true);
          $mail->Subject = '비밀번호 재설정';
          $mail->Body = '새로운 비밀번호: ' . $newPassword;
      
          // 이메일 전송
          $mail->send();
      
          return '이메일 전송 완료!';
        } catch (Exception $e) {
            return "이메일 전송 중 오류 발생: {$e->getMessage()}";
        }
    }

    function generateRandomPassword($length = 10) {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        $password = '';
        
        $characterCount = strlen($characters);
        
        for ($i = 0; $i < $length; $i++) {
            $index = random_int(0, $characterCount - 1);
            $password .= $characters[$index];
        }
        
        return $password;
    }
    $newPassword = generateRandomPassword(10);
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);

    if(isset($_POST) && $_SERVER['REQUEST_METHOD'] == "POST") {     // 비정상 접속을 막기 위함 (POST로 접속 시 데이터 전송)
        $_POST = json_decode(file_get_contents("php://input"),true); 
        @extract($_POST); // $_POST['loginID'] 라고 쓰지 않고, $loginID 라고 써도 인식되게 함
        $host = 'localhost';
        $user = 'violet';
        $pw = 'violet123';
        $dbName = 'music';

        $conn = mysqli_connect($host, $user, $pw, $dbName);
        if(!$conn){
            die("접속 실패: ". $conn->connect_error);
        }

        $sql = "SELECT email FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_array($result);
 
        if ($row != NULL) { // 이메일 DB확인
            $result_msg = sendPasswordResetEmail($email, $newPassword);
            $result_response = json_encode(["status" => "login", "message" => $result_msg, 'response' => 200]);
            $sql = "UPDATE user SET pwd = '$hash' WHERE email = '$email'";
            $result = mysqli_query($conn, $sql);
        }
        else {// 이메일 계정 DB없음
            $result_response = json_encode(["status" => "fail", "message" => $result_msg, 'response' => 400]);
        }
        echo $result_response;
    }
?>