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

        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];

        $sqlDeleteUser = "DELETE FROM user WHERE no = '$userNo'";
        $sqlDeleteStreaming = "DELETE FROM streaming WHERE user_no = '$userNo'";
        $sqlDeletePlaylist = "DELETE playlist, playlist_song
                      FROM playlist
                      LEFT JOIN playlist_song ON playlist.no = playlist_song.playlist_no
                      WHERE playlist.user_no = '$userNo'";
        $sqlDeleteMlike = "DELETE FROM mlike WHERE user_no = '$userNo'";
        $sqlDeleteFriend = "DELETE FROM friend WHERE user_no = '$userNo' OR friend_no ='$userNo'";

        $sqlif ="SELECT *
        FROM friend
        WHERE user_no = '$userNo'";

        $resultif = mysqli_query($conn,$sqlif);

        // 실행
        
        $result1 = mysqli_query($conn, $sqlDeleteStreaming);
        $result3 = mysqli_query($conn, $sqlDeletePlaylist);
        $result4 = mysqli_query($conn, $sqlDeleteMlike);
        if($resultif){
            $sql="UPDATE user
                SET followers = followers - 1
                WHERE no IN (
                SELECT friend_no
                FROM friend
                WHERE user_no = '$userNo'
            )";
            $resultif1= mysqli_query($conn,$sql);
            $result5 = mysqli_query($conn, $sqlDeleteFriend);
        }else{
        $result5 = mysqli_query($conn, $sqlDeleteFriend);
        }
        $result = mysqli_query($conn, $sqlDeleteUser);

        if ($result && $result1 && $result3 && $result4 && $result5) {
            // 삭제 성공
            $result_response = json_encode(["status" => "success", "message" => "delete success", 'response' => 200]);
        } else {
            // 삭제 실패
            $result_response = json_encode(["status" => "fail", "message" => $songNo, 'response' => 400]);
        }
        echo $result_response;
    }
?>