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

        $sqlUser = "SELECT no FROM user WHERE nickname = '$nickname'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo = $rowUser['no'];

        $sqlUser = "SELECT no FROM user WHERE email = '$email'";
        $resultUser = mysqli_query($conn, $sqlUser);
        $rowUser = mysqli_fetch_assoc($resultUser);
        $userNo2 = $rowUser['no'];

        $sqlMlike = "SELECT song.no, IFNULL(mlike.mlike, 0) AS mlike
        FROM song
        LEFT JOIN mlike ON song.no = mlike.song_no AND mlike.user_no = '$userNo2'";

        $sql="SELECT streaming.clickcount, streaming.clickdate, song.*, album.img_route, IFNULL(mlike.mlike, 0) AS mlike
        FROM streaming
        INNER JOIN song ON streaming.song_no = song.no
        INNER JOIN album ON song.album_no = album.no
        LEFT JOIN mlike ON mlike.user_no = streaming.user_no AND mlike.song_no = song.no
        WHERE streaming.user_no = '$userNo'
        AND streaming.clickcount IS NOT NULL
        AND streaming.clickdate IS NOT NULL";

        $result = mysqli_query($conn, $sql);
        $resultMlike = mysqli_query($conn, $sqlMlike);
        $rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
        $rowsMlike = mysqli_fetch_all($resultMlike, MYSQLI_ASSOC);

        foreach ($rows as &$row) {
            foreach ($rowsMlike as $mlike) {
                if ($row['no'] === $mlike['no']) {
                    $row['mlike'] = $mlike['mlike'];
                    break;
                }
            }
        }        
        
        if ($rows != null) {
            $result_response = json_encode(["status" => "success", "message" => $rows, 'response' => 200]);
        }
        else {
            $result_response = json_encode(["status" => "fail", "message" => $songNo, 'response' => 400]);
        }
        echo $result_response;
    }
?>