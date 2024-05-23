<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header('Content-Type: application/json');

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

        // title로 song 테이블에서 song.no 가져오기
        $sql = "SELECT no FROM user WHERE email = '$email'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        $userNo = $row['no'];

        $sql = "SELECT * FROM playlist  WHERE user_no='$userNo' AND playlist_name='$playlist_name'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);

        if ($row == null) {
            $sql = "INSERT INTO playlist (user_no, playlist_name) VALUE('$userNo', '$playlist_name')";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);

            $result_response = json_encode(["status" => "success", "message" => "", 'response' => 200]);
        } 
        else {
            $result_response = json_encode(["status" => "fail", "message" => "", 'response' => 400]);
        }
        echo $result_response;
    }
?>