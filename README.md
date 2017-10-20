# image_server
由mysql 限制
ID clas cate

ID為該資料表的用戶ID

clas 為自己編的
var pathtable = ["test", "mem", "shop", "bos", "pro", "gift", "ad"];

cate 為該圖的種類 (目前只有mem_data 有兩種類的圖)
var pathfield = ["test", "image", "logo", "cover"];

所有種類
 //所有正確組合 X11 X13 X22 X32 X41 X51 X61
 
 ex1:當member id:1 想要上傳image
 傳{
 "id":1,
 "clas":1,
 "cate":1,
 "base64str":"image to base64"
 }
 ex2:當一個shop ID:10 想要上傳logo
 傳{
 "id":10,
 "clas":2,
 "cate":2,
 "base64str":"logo to base64"
 }
 
//後台該注意的
由於 ad pro 都屬於次級資料表 屬於(shop or bos)
但寫入還是要認ad_id or pro_id

//管理帳號
gift 寫入圖片也是任 gift_id