<?php


// 格式化时间
function timeToRelativeString($timestamp) {
    // 将时间戳转换为当前时区的 DateTime 对象
    $time = new DateTime("@$timestamp");
    // 获取当前时间的 DateTime 对象
    $now = new DateTime();
    // 计算两个时间点之间的间隔
    $interval = $now->diff($time);

    // 判断时间是在当前时间之前还是之后
    $isFuture = $interval->invert ? '前' : '后';

    if ($interval->y > 0) {
        // 如果差值超过1年，按照“年月日”格式返回
        return $time->format('Y年m月d日');
    } elseif ($interval->m > 0) {
        // 如果差值超过1个月但不超过1年，按照“年月日”格式返回
        return $time->format('Y年m月d日');
    } elseif ($interval->d >= 1) {
        // 如果差值超过1天但不超过1个月，返回天数
        return $interval->d . "天" . $isFuture;
    } elseif ($interval->h >= 1) {
        // 如果差值超过1小时但不超过24小时，返回小时数
        return $interval->h . "小时" . $isFuture;
    } elseif ($interval->i >= 1) {
        // 如果差值超过1分钟但不超过60分钟，返回分钟数
        return $interval->i . "分钟" . $isFuture;
    } else {
        // 如果差值小于1分钟，返回“刚刚”
        return "刚刚";
    }
}

/**
 * 获取网络文件大小
*/
function get_file_size($url) {
    $url = parse_url($url);
    if (empty($url['host'])) {
        return false;
    }
    $url['port'] = empty($url['post']) ? 80 : $url['post'];
    $url['path'] = empty($url['path']) ? '/' : $url['path'];
    $fp = fsockopen($url['host'], $url['port'], $error);
    if($fp) {
        fputs($fp, "GET " . $url['path'] . " HTTP/1.1\r\n");
        fputs($fp, "Host:" . $url['host']. "\r\n\r\n");
        while (!feof($fp)) {
            $str = fgets($fp);
            if (trim($str) == '') {
                break;
            }else if(preg_match('/Content-Length:(.*)/si', $str, $arr)){
                return trim($arr[1]);
            }
        }
        fclose ( $fp);
        return false;
    }else{
        return false;
    }
}
/**
 * 判断文件类型
 * 文本：js\css\html\htm\xhtml\txt\cvs\xml\pdf\doc\ppt\xlsx\xls\pptx\docx
 * 图片：jpg\jpeg\jpe\jp2\gif\png\ico\svg\bmp
 * 音视频：mp3\mp4\mov\mpe\mpeg\mpeg\wma
 * 其他：zip\swf\ttf\eot\otf\fon\font\ttc\woff\woff2
*/
function chkFType($mimetype){
    $typearr=array('js','css','html','htm','xhtml','xml','txt','cvs','pdf','doc','docx','ppt','pptx','xls','xlsx','jpg','jpeg','jpe','jp2','gif','png','ico','svg','bmp','mp3','mp4','mov','mpe','mpeg','wma','zip','swf','ttf','eot','otf','fon','font','ttc','woff','woff2','JPG','PNG','JPEG','GIF','BMP');
    if(in_array($mimetype,$typearr)){
        return true;
    }else{
        return false;
    }
}
/**
 * 获取设备类型
 */
function getDeviceType($userAgent = null) {
    // 如果没有提供用户代理字符串，则使用当前请求的HTTP_USER_AGENT
    if (is_null($userAgent)) {
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
    }

    // 定义一些设备和浏览器的关键字
    $mobileKeywords = ['Mobile', 'iPhone', 'Android'];
    $tabletKeywords = ['iPad', 'Tablet'];

    // 检查是否为移动设备
    foreach ($mobileKeywords as $keyword) {
        if (stripos($userAgent, $keyword) !== false) {
            return 'mobile';
        }
    }

    // 检查是否为平板设备
    foreach ($tabletKeywords as $keyword) {
        if (stripos($userAgent, $keyword) !== false) {
            return 'tablet';
        }
    }

    // 默认为桌面设备
    return 'pc';
}
/**
     * 下载网络文件
    */
    function download_file($url) {
        $time = time();
        $arr = parse_url($url);
        $arr2 = pathinfo($arr['path']);
        $local_path = dirname(__FILE__) . '/cacheLittleFile';
        $extension = isset($arr2["extension"]) ? $arr2["extension"] : '';
    
        if (empty($extension) || strpos($extension, '@') !== false) {
            // 如果没有扩展名或者扩展名不正确，尝试从 Content-Type 中获取
            $content_type = get_headers($url, 1)['Content-Type'];
            if ($content_type) {
                $extension = strtolower(substr(strrchr($content_type, '/'), 1));
            }
        }
    
        if (empty($extension)) {
            // 如果仍然没有扩展名，使用默认扩展名
            $extension = 'bin';
        }
    
        $filename = 'lf-' . $time . '.' . $extension;
        $local = $local_path . '/' . $filename;
    
        // 确保本地路径存在
        if (!file_exists($local_path)) {
            mkdir($local_path, 0777, true);
            chmod($local_path, 0777);
        }
    
        // 下载文件
        $img = file_get_contents($url);
        if ($img === false) {
            return false; // 下载失败
        }
    
        // 保存文件
        file_put_contents($local, $img);
        return $local;
    }

/**
 * 验证图片是否符合指定尺寸
*/
function validateImgSize($imgurl,$req_width,$req_height){
    $ch = curl_init();
            
    // 设置cURL选项
    curl_setopt($ch, CURLOPT_URL, $imgurl);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
    
    // 执行cURL会话并获取图片内容
    $imageData = curl_exec($ch);
    
    // 关闭cURL会话
    curl_close($ch);
    
    // 临时保存图片内容到字符串
    $tempFile = tempnam(sys_get_temp_dir(), 'img');
    file_put_contents($tempFile, $imageData);
    
    // 使用getimagesize()函数获取图片尺寸
    $imageSize = getimagesize($tempFile);
    
    if ($imageSize) {
        $width = $imageSize[0];
        $height = $imageSize[1];
        if($width != $req_width || $height != $req_height){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
/**
 * 验证Url是否能正常访问
*/
function isUrlAccessible($url) {
    // 初始化cURL会话
    $ch = curl_init($url);

    // 设置cURL选项
    curl_setopt($ch, CURLOPT_NOBODY, true); // 仅检查HTTP头
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // 允许重定向
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // 返回结果而不是直接输出
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); // 设置超时时间

    // 执行cURL会话
    $data = curl_exec($ch);

    // 获取HTTP状态码
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // 关闭cURL会话
    curl_close($ch);

    // 检查HTTP状态码是否为200（成功）
    return $httpcode == 200;
}
/**
 * 验证Url地址
*/
function validateUrl($url) {
    // 正则表达式匹配URL，支持http, https, ftp, ftps协议，以及查询参数
    $pattern = "/^(https?|ftp|ftps):\/\/[a-zA-Z0-9-.]+\.[a-zA-Z]{2,3}(\/\S*)?$/";

    // 使用filter_var进行验证，FILTER_VALIDATE_URL检查URL是否有效
    if (filter_var($url, FILTER_VALIDATE_URL) !== false) {
        // 进一步使用正则表达式检查URL是否符合特定格式
        return preg_match($pattern, $url);
    }

    return false;
}
/**
 * 验证字符串：最多16个字符或者8个汉字
*/
function isValidString($str) {
    return isValidStringForLen($str,8);
}
/**
 * 验证字符串：特定长度
*/
function isValidStringForLen($str,$len) {
    // 计算字符串的长度（字符数）
    $strlen = mb_strlen($str, 'UTF-8');
    
    // 计算汉字的数量，假设汉字为3个字节
    $chineseCharCount = mb_strlen($str, 'UTF-8') - mb_strlen($str, 'ASCII');
    
    // 如果字符串长度不超过16且汉字数量不超过8，则验证通过
    if ($strlen <= 2*$len && $chineseCharCount <= $len) {
        return true;
    }
    
    return false;
}
/**
 * 返回正确结果
 */
function success($data=array(), $msg="success"){
    $res = array(
        "status" => 0,
        "data" => $data,
        "msg"  => $msg
    );
    header("Content-Type:application/json;charset=utf-8");
    echo json_encode($res,JSON_UNESCAPED_UNICODE);
    exit;
}
/**
 * 返回错误结果
 */
function error($msg="err", $code=400){
    $res = array(
        "status" => $code,
        "msg"  => $msg,
        "data"=>array()
    );
    header("Content-Type:application/json;charset=utf-8");
    echo json_encode($res,JSON_UNESCAPED_UNICODE);
    exit;
}
/**
 * 获取IP地址
 */
function getIp(){
    $ip = '';
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // 如果IP地址可能被伪造，进一步处理
    $ip = filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
      return $ip;
}
 /**
 * 判断是否为空或者为0
 */
function isNullOrEmpty($paramName,$defaultValue=""){
    if(isset($paramName) && !empty($paramName)){
        if($paramName/1 == -9999){
            return 0;
        }
        return $paramName;
    }else{
        return $defaultValue;
    }
}
/**
 * 生成6位随机的验证码
*/
function generateSMSCode() {
    $code = '';
    for ($i = 0; $i < 6; $i++) {
      $code .= rand(0, 9); // 将每个随机数字拼接到验证码字符串中
    }
    return $code; // 返回生成的6位随机数字验证码
}
/**
 * 生成UUID
*/
function generateUUID($length = 36) {
    if (function_exists('com_create_guid')) {
        $uuid = com_create_guid();
    } else {
        mt_srand((double)microtime() * 10000);
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);
        $uuid = substr($charid, 0, 8) . $hyphen
            . substr($charid, 8, 4) . $hyphen
            . substr($charid, 12, 4) . $hyphen
            . substr($charid, 16, 4) . $hyphen
            . substr($charid, 20, 12);
    }
    return substr($uuid, 0, $length);
}
/**
 * 生成订单号
 */
function generateOrderId($prefix = '20') {
    // 获取当前的时间戳的整数部分，即秒数
    $timestamp = (int) time();
    
    // 将时间戳转换为字符串，并确保是14位长，不足前面补0
    $timestampStr = str_pad((string)$timestamp, 14, '0', STR_PAD_LEFT);
    
    // 生成一个随机数，这里使用14位，可以根据需要调整长度
    // 使用 str_pad 确保随机数是14位的字符串
    $randomPart = str_pad((string)rand(1, 999999999999), 14, '0', STR_PAD_LEFT);
    
    // 组合订单编号，前面添加前缀
    $orderId = $prefix . $timestampStr . $randomPart;
    
    // 返回生成的订单编号
    return mb_substr($orderId, 0, $prefix);
}
/**
 * 读取json文件
 * @param string $filePath 文件路径
 * @return array
 */
function readJsonFileToArray($filePath) {
    // 确保文件存在
    if (!file_exists($filePath)) {
        throw new Exception("文件不存在: " . $filePath);
    }

    // 读取文件内容
    $fileContent = file_get_contents($filePath);

    // 将JSON字符串解码为PHP数组
    $data = json_decode($fileContent, true);

    // 检查JSON解码是否成功
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON解码错误: " . json_last_error_msg());
    }

    // 返回解码后的数组
    return $data;
}
/**
 * 发送GET请求
 * @param string $url
 * @return mixed
 */
function sendGet($url){
    $ch = curl_init();
    //设置选项，包括URL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);

    //执行并获取HTML文档内容
    $output = curl_exec($ch);
    //释放curl句柄
    curl_close($ch);
    return $output;
} 
/**
 * 发送post请求
 * @param string $url
 * @param array $post_data
 * @return mixed
 */
function sendGetWithHead($url,$header){
    $ch = curl_init();
    //设置选项，包括URL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 

    //执行并获取HTML文档内容
    $output = curl_exec($ch);
    //释放curl句柄
    curl_close($ch);
    return $output;
} 
/**
 * 发送https请求
 * @param string $url
 * @param string $header
 * @return mixed
 */
function sendHttps($url,$header=''){

    //$url ="https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo=".$bank_card."&cardBinCheck=true";

    $ch = curl_init();

    //设置选项，包括URL
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);//绕过ssl验证
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    if(!empty($header)){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
    }
    //执行并获取HTML文档内容
    $output = curl_exec($ch);

    //释放curl句柄
    curl_close($ch);
    return $output;
}
/**
 * PHP发送Json对象数据
 * @param $url 请求url
 * @param $jsonStr 发送的json字符串
 * @return array
 */
function http_post_json($url, $jsonStr)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonStr);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json; charset=utf-8',
            'Content-Length: ' . strlen($jsonStr)
        )
    );
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return array($httpCode, $response);
}
/**
 * 模拟post进行url请求
 * @param string $url
 * @param string $data_string
 * @param string $header
 * @return array
 */
function http_post_data($url, $data_string,$header='') {   
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_POST, 1); 
    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);//绕过ssl验证
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string); 
    if(!empty($header)){
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
    }
    ob_start(); 
    curl_exec($ch); 
    $return_content = ob_get_contents(); 
    ob_end_clean(); 
    $return_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
    // return array($return_code, $return_content); 
    return $return_content; 
} 
/**
* 综合方法
* 
* @param mixed $url             访问的URL，暂时不支持https
* @param mixed $post            要传递的数据  (不填则为GET)
* @param mixed $header          Header头
* @param mixed $cookie          提交的$cookies                         
* @param mixed $returnCookie    是否返回$cookies
*/
 function sendPost($url,$post='',$header='',$cookie='', $returnCookie=0){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);//绕过ssl验证
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        if(!empty($header)){
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        }
        //curl_setopt($curl, CURLOPT_REFERER, "http://XXX");
        if($post) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post));
        }
        if($cookie) {
            curl_setopt($curl, CURLOPT_COOKIE, $cookie);
        }
        curl_setopt($curl, CURLOPT_HEADER, $returnCookie);
        curl_setopt($curl, CURLOPT_TIMEOUT, 3000);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $data = curl_exec($curl);
        if (curl_errno($curl)) {
            return curl_error($curl);
        }
        curl_close($curl);
        if($returnCookie){
            list($header, $body) = explode("\r\n\r\n", $data, 2);
            preg_match_all("/Set\-Cookie:([^;]*);/", $header, $matches);
            $info['cookie']  = substr($matches[1][0], 1);
            $info['content'] = $body;
            return $info;
        }else{
            return $data;
        }
}
/**
 * 格式化数目
 */
function format_number($number) {
    // 定义单位数组
    $units = array("", "万", "亿");
    $unitIndex = 0; // 单位索引

    // 将数字转换为浮点数
    $num = (float)$number;

    // 根据数字大小选择单位
    while ($num >= 10000) {
        $num /= 10000;
        ++$unitIndex;
    }

    // 格式化数字为字符串，并保留一位小数（如果不是整数则保留）
    $formattedNum = ($unitIndex > 0) ? round($num, 1) : intval($num);
    $formattedNumStr = strval($formattedNum);
    $formattedNumStr = ($formattedNumStr[strlen($formattedNumStr) - 1] === '0') ? rtrim($formattedNumStr, '0') : $formattedNumStr;

    // 添加单位
    $formattedNumStr .= $units[$unitIndex];

    return $formattedNumStr;
}
/**
 * 字符串超长用省略号
 */
function truncateStringWithEllipsis($string, $length, $appendEllipsis = true) {
    // 如果字符串长度小于或等于指定长度，则返回原字符串
    if (mb_strlen($string, 'UTF-8') <= $length) {
        return $string;
    }

    // 截取指定长度的字符串
    $truncatedString = mb_substr($string, 0, $length, 'UTF-8');

    // 如果需要添加省略号
    if ($appendEllipsis) {
        $truncatedString .= '...';
    }

    return $truncatedString;
}
function GetBody($url, $xml,$method='POST'){    
    $second = 30;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_TIMEOUT, $second);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,false);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    $data = curl_exec($ch);
    if($data){
      curl_close($ch);
      return $data;
    } else { 
      $error = curl_errno($ch);
      curl_close($ch);
      return false;
    }
}
/**
 * 手机号码隐藏
 */
function formatPhoneNumber($phoneNumber) {
    // 检查手机号长度是否符合标准手机号长度
    if (strlen($phoneNumber) != 11) {
        return '手机号格式不正确';
    }

    // 提取前三位和后四位
    $firstThree = substr($phoneNumber, 0, 3);
    $lastFour = substr($phoneNumber, -4);

    // 使用星号替换中间的四位数字
    $middleStars = str_repeat('*', 4);

    // 拼接最终的手机号格式
    $formattedPhoneNumber = $firstThree . $middleStars . $lastFour;

    return $formattedPhoneNumber;
}



?>