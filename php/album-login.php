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

        $sql="SELECT distinct album.album, album.img_route, artist.artist, song.title, song.lyrics, song.mp3_route, mlike.mlike
        FROM song
        JOIN album ON song.album_no = album.no
        JOIN artist ON album.artist_no = artist.no
        LEFT JOIN mlike ON song.no = mlike.song_no AND mlike.user_no = '$userNo'
        WHERE album.album IN (
            SELECT album.album
            FROM song
            JOIN album ON song.album_no = album.no
            WHERE song.title = '$title')
            OR song.title IN (
                SELECT song.title
                FROM song
                JOIN album ON song.album_no = album.no
                WHERE song.title = '$title' OR album.album = '$title'
            )";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_all($result, MYSQLI_ASSOC);

        if ($row != null) {
            $result_response = json_encode(["status" => "success", "message" => $row, 'response' => 200]);
        }
        else {
            $result_response = json_encode(["status" => "fail", "message" => "", 'response' => 400]);
        }
        echo $result_response;
    }
?>