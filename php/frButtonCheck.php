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
        $sqlFriend = "SELECT no FROM user WHERE nickname = '$nickname'";
        $resultFriend = mysqli_query($conn, $sqlFriend);
        $rowSong = mysqli_fetch_assoc($resultFriend);
        $friendNo = $rowSong['no'];

        // email로 user 테이블에서 user.no 가져오기
        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];

        $sqlifFriend = "SELECT user_no, friend_no FROM friend WHERE user_no = '$userNo' AND friend_no = '$friendNo'";
        $ifresult = mysqli_query($conn, $sqlifFriend);
        $row = mysqli_fetch_assoc($ifresult);

        if (!empty($row)) {
            $result_response = json_encode(["status" => "ifFriend", "message" => "ifFriend", 'response' => 200]);
        } else {
            $result_response = json_encode(["status" => "notFriend", "message" => $row, 'response' => 400]);
        }

        echo $result_response;
    }
?>