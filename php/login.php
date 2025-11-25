<?php
session_start();
$msg = ""; // initialize variable

if(isset($_POST['email'])){
    if($_POST['captcha'] != $_SESSION['cap']){
        $msg = "Wrong captcha!";
    } else {
        $data = [
            "email" => $_POST['email'],
            "password" => $_POST['password']
        ];

        // Corrected URL spelling
        $ch = curl_init("http://localhost:3000/api/login");

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); // safest

        $res = curl_exec($ch);

        // Check curl error
        if(curl_errno($ch)){
            $msg = "Curl Error: " . curl_error($ch);
        } else {
            $msg = $res;
        }
        
    }
}
?>

<form method="post">
    Email: <input name="email"><br>
    Password: <input name="password"><br>
    <img src="captcha.php"><br>
    Enter Captcha : <input name="captcha"><br>
    <button>Submit</button>
</form>

<?= $msg ?>
