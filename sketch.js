let jsobj;
let img;
let val, btn;
let objs=[];
let inconsolata;
// 因為傳輸資料需要時間 因此預載
function preload() {
    val = document.getElementById("magsize").value; // 先取得 index 中 magsize 的 val 後
    jsobj = loadJSON('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-11-02&minmagnitude='+val); // 再向資料庫取得資料
    img = loadImage('wgs84.png');
    btn = document.getElementById("submit"); // 定義 index 中 submit 按鈕
    btn.addEventListener('click', () =>{ // 持續傾聽 該按鈕 當按鈕 被按下時
      console.log("reloading"); // 印出 reloading
      val = document.getElementById("magsize").value; // 先取得 index 中 magsize 的 val 後
      // 使用 callback 方式 = loadJSON(讀取網址 ,完成後再執行本函式)
    jsobj = loadJSON('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-11-02&minmagnitude='+val, init);
      
    });
    inconsolata = loadFont('Inconsolata-Light.otf');
}
// 預載後執行
function setup() {
  // 經度為 -180-80 緯度為 -90-90
  createCanvas(360, 180,WEBGL);
  init();
}
//將原本建構在setup底下的內容用一個函式來表示
function init(){
  if (jsobj !== undefined){
    textFont(inconsolata);
    textSize(13);
    // 取出資料中的 每個物件 命名為 o
    jsobj.features.forEach((b)=>{
      // 經度 在 geometry 底下 coordinates 第一筆資料
      lon = b.geometry.coordinates[0];
      // 緯度 在 geometry 底下 coordinates 第二筆資料
      lat = b.geometry.coordinates[1];
      // 震度 在 properties底下
      ms= b.properties.mag;
      nam = b.properties.place;
      //noStroke();
      //fill(150,50,50,3);
      //circle(lon,-lat, ms*7);
      objs.push(new myobj(lon,-lat,0,ms*2,nam))
    });
  }
}

function draw() {
  // 先放底圖
  image(img, -width/2, -height/2, width, height);
  objs.forEach((v)=>{
    v.display();
  })
}
// 物件導向的寫法
class myobj {
  // 怎麼建構這個物件
  constructor(x,y,z,size, name){
    this.x = x; this.y = y; this.z = z; this.size = size;
    this.Xrotate = 0;
    this.Yrotate = 0;
    this.Cred = 150;
    this.name = name;
    this.on =false;
  }
  // 能力
  display(){
      if (this.on){  
        fill(180,0,180);
        text(this.name, this.x+20,this.y,30);
      }
      push();
        fill(this.Cred,50,50,100);
        translate(this.x,this.y,this.z); // 3 再移動
        if ((mouseX-width/2)>this.x-this.size/2 &&
            (mouseX-width/2)<this.x+this.size/2 &&
            (mouseY-height/2)>this.y-this.size/2 &&
            (mouseY-height/2)<this.y+this.size/2
           ){
            rotateX(this.Xrotate);//
            rotateY(this.Yrotate); // 2 先轉動
            box(this.size+10); // 1 做元件
            this.Xrotate=this.Xrotate+0.04;
            this.Yrotate=this.Yrotate+0.04;
            this.Cred=150+sin(radians(frameCount))*100;
            this.on = true;
        }else{
            this.Cred = 150;
            rotateX(this.Xrotate);//
            rotateY(this.Yrotate); // 2 先轉動
            box(this.size); // 1 做元件
            this.on = false;
        }  
      pop();
  }
}