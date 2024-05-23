<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header('Content-Type: application/json');

    function generateToken(){
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];
        $header = json_encode($header);
        $header = base64_encode($header);
    
        $payload = [
            'user' => $email,
            'expires' => time() + (5*60) // 토큰 만료 시간: 현재 시간 + 1시간
        ];
        $payload = json_encode($payload);
        $payload = base64_encode($payload);
    
        $signature = hash_hmac('sha256', "$header.$payload", 'asdqwezxc', true);
        $signature = base64_encode($signature);
    
        $token = "$header.$payload.$signature";
        return $token;
    }
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
        
        $sql = "SELECT * FROM user WHERE email='$email'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_array($result);
        
        if ($row != null) {
            
            if (password_verify($password, $row['pwd'])) {
                // 비밀번호 일치 로그인 성공
                $token = generateToken(); // 토큰 생성 함수 호출
                $sql = "SELECT signdata,email,nickname FROM user WHERE email='$email'";
                $result = mysqli_query($conn, $sql);
                $row = mysqli_fetch_array($result);
                $result_response = json_encode(["status" => "login", "message" => $row,"token" => $token, 'response' => 200]);
                
            } else {
                // 비밀번호 일치하지 않으면 로그인 실패
                $result_response = json_encode(["status" => "fail", "message" => "Incorrect password", 'response' => 400]);
            }
        } else {
            // 이메일이 등록되지 않은 계정
            $result_response = json_encode(["status" => "fail", "message" => "Incorrect email", 'response' => 400]);
        }
        echo $result_response;
    }
?>
