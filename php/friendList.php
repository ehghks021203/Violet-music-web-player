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

        // email로 user 테이블에서 user.no 가져오기
        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];

        $sqlFriend = "SELECT friend_no FROM friend WHERE user_no = '$userNo'";
        $resultFriend = mysqli_query($conn, $sqlFriend);
        $rowsFriend = mysqli_fetch_all($resultFriend, MYSQLI_ASSOC);
        $friendNos = [];

        foreach ($rowsFriend as $row) {
            $friendNos[] = $row['friend_no'];
        }

        $rowUserInfo = [];
        foreach ($friendNos as $friendNo) {
            $sqlUserInfo = "SELECT img_route, followers, nickname FROM user WHERE no = '$friendNo'";
            $resultUserInfo = mysqli_query($conn, $sqlUserInfo);
            $rowUserInfo[] = mysqli_fetch_assoc($resultUserInfo);
        }

        if ($rowUserInfo != null) {
            $result_response = json_encode(["status" => "success", "message" => $rowUserInfo, 'response' => 200]);
        }
        else {
            $result_response = json_encode(["status" => "fail", "message" => "", 'response' => 400]);
        }
        echo $result_response;
    }
?>