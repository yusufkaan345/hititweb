let addingTrianglePoint = false; // Üçgen eklemek için kullanılacak değişken
let addingLinePoint = false;      //Çizgi eklemek için kullanıclacak değişken

const pointTriangleList = []; // Üçgen nokta koordinatlarını saklamak için bir dizi
const pointLineList = []        //Çizgi nokta koordinatlarını saklamak için bir dizi

const pointTriangleSets = []; // Üçgen nokta kümelerini saklamak için bir dizi.Yani bir üçgen oluşturulduğunda dizi olarak tüm koordinatlar bunun içinde olacak 
const pointLineSets = [];      // Çizgi nokta kümelerini saklamak için kullanılacak dizi
const pointSets = []           // Üçgen ve çizgilerden oluşan bir harf seti. Save bastığında setler içerisindeki nokta ve çizgileri alıp bu son liste içerisinde o heceyi saklayacak.

const container = document.getElementById('container-image'); //htmldeki container kısmını alıp nokta ekleyebilmemizi sağlıyor

let lineList = [];     //eklenen her bir çizgiyi kaydettiğimiz yer . Su an çizgilerle bir işimiz yok ama yinede bir id ile kaydettim hepsini.
let lineCounter = 0; // Çizgiye benzersiz bir id atamak için sayaç
let dotCounter = 0;   // Noktaya benzersiz id atamak için sayaç

const MIN_DISTANCE_THRESHOLD = 10;  // Eklenen çizgi  ile üçgen noktalarının koordinatları arasındaki mesafe bundan küçükse  

// düğmeleri değişkene atadım
var zoomInButton = document.getElementById("zoomInButton");
var zoomOutButton = document.getElementById("zoomOutButton");
var tablet = document.getElementById("tablet");
// Başlangıç zoom düzeyi
var zoomLevel = 1;

// Zoom-In düğmesine tıklanırsa zoomIn fonksiyonunu çağırdım.
zoomInButton.addEventListener("click", zoomIn);
// Zoom-Out düğmesine tıklanırsa zoomOut fonksiyonunu çağırdım.
zoomOutButton.addEventListener("click", zoomOut);

// zoom fonksiyonları
function zoomIn() {
    zoomLevel += 0.1;
    tablet.style.transform = "scale(" + zoomLevel + ")";
}
function zoomOut() {
    if (zoomLevel > 0.2) { 
        zoomLevel -= 0.1;
        tablet.style.transform = "scale(" + zoomLevel + ")";
    }
}

document.getElementById('addTriangleBtn').addEventListener('click', function () {
    addingTrianglePoint = true; // add triangle butonuna tıklandığında eklemeye başlayın
    addingLinePoint = false
});
document.getElementById('addLineBtn').addEventListener('click', function () {
    addingLinePoint = true; // add line butonuna tıklandığında eklemeye başlayın
    addingTrianglePoint = false;
});


container.addEventListener('click', function (event) {

    // Bu if te üçgen oluşuyor
    if (addingTrianglePoint) {
        const point = document.createElement('div'); //noktayı bir div elementi olarak oluşturur.
        const pointId = `point-${dotCounter}`; // Benzersiz bir ID oluştur
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.style.left = (event.clientX - container.getBoundingClientRect().left) + 'px';
        point.style.top = (event.clientY - container.getBoundingClientRect().top) + 'px';

        // Noktanın koordinatlarını diziye ekle
        pointTriangleList.push({ id: pointId, x: point.style.left, y: point.style.top });

        // Yeni noktayı tıkladığınızda koordinat listesine ekleyin
        container.appendChild(point);

        // En az iki nokta varsa çizgi çiz
        if (pointTriangleList.length >= 2) {
            const firstPoint = pointTriangleList[0];                              //ilk nokta
            const middlePoint = pointTriangleList[pointTriangleList.length - 2]; // orta  nokta
            const endPoint = pointTriangleList[pointTriangleList.length - 1]; // En son nokta

            drawLine(document.getElementById(middlePoint.id), document.getElementById(endPoint.id));       //Noktalar arası çizgi ekleme      

            if (pointTriangleList.length == 3) {
                drawLine(document.getElementById(firstPoint.id), document.getElementById(endPoint.id));  //3 nokta olduğunda otomatik ilk ve son nokta arasına çizgi ekleme

                addingTrianglePoint = false; //Başka nokta eklemeyi sonlandır.Çünkü 3 nokta ile üçgen oluştu.

                // Noktaları  bir küme olarak kabul et.Bu üçgenin noktalarının hepsini alıp obj olarak pointTriangleSets kümesine ekle. 
                const newPointSet = pointTriangleList.slice();
                console.log(newPointSet)
                pointTriangleSets.push(newPointSet);
                pointTriangleList.length = 0; // Nokta listesini temizle. Yeni oluşacak üçgenin noktalarını almak için boş olması gerekiyor 


            }
        }
    }

    //Bu if te  çizgi oluşuyor
    if (addingLinePoint) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.style.left = (event.clientX - container.getBoundingClientRect().left) + 'px';
        point.style.top = (event.clientY - container.getBoundingClientRect().top) + 'px';

        // Çizginin eklenen noktası üçgenin hangi noktasına yakın for ile kontrol et
        for (const triangleSet of pointTriangleSets) {  //Üçgen noktalarını pointTriangleSets buradan alıyoruz çünkü pointTriangleList listesini her üçgen oluştutduktan sonra temizliyoruz
            for (const trianglePoint of triangleSet) {

                const distance = Math.sqrt(    // Çizginin eklenen noktasının  üçgenlerin noktaları arasındaki uzaklığı hesaplıyor. 10 ten küçükse çizginin o noktasını üçgenin o noktasına eşitliyor. 
                    Math.pow(parseFloat(point.style.left) - parseFloat(trianglePoint.x), 2) +
                    Math.pow(parseFloat(point.style.top) - parseFloat(trianglePoint.y), 2)
                );
                console.log(distance);

                if (distance <= MIN_DISTANCE_THRESHOLD) { // Uzanlık 10 ten küçükse çizginin o koordinatını üçgenin o noktasına eşitle
                    
                    point.style.left = trianglePoint.x;
                    point.style.top = trianglePoint.y;
                    break; // Stop checking once a close point is found
                }
            }
            if (point.style.left != (event.clientX - container.getBoundingClientRect().left) + 'px') {
                break; // Stop checking other triangle sets if a close point is found
            }
        }

        // Noktanın koordinatlarını diziye ekle
        pointLineList.push({ id: pointId, x: point.style.left, y: point.style.top });
        container.appendChild(point); //noktayı containera ekle

        if (pointLineList.length == 2) {
            const firstPoint = pointLineList[0];  // Çizgi 1.nokta
            const secondPoint = pointLineList[1]; // Çizgi 2.nokta

            drawLine(document.getElementById(firstPoint.id), document.getElementById(secondPoint.id));
            addingLinePoint = false;

            const newPointSet = pointLineList.slice();
            console.log(newPointSet);
            pointLineSets.push(newPointSet);
            pointLineList.length = 0; // Çizgi nokta listesini temizle
        }
    }

});

function drawLine(point1, point2) {
    const line = document.createElement("div");
    line.className = 'line'
    line.id = `line-${lineCounter}`
    lineCounter++;

    line.style.position = "absolute";
    line.style.border = "0.2px solid white";
    line.style.backgroundColor = "white";
    line.style.width = "0.2px";
    line.style.height = "0.2px";
    line.style.left = (parseFloat(point1.style.left) + 2.4) + "px"; // Başlangıç noktasını point1'in x koordinatına ayarla
    line.style.top = (parseFloat(point1.style.top) + 2.4) + "px"; // Başlangıç noktasını point1'in y koordinatına ayarla

    // Çizgiyi point1'den point2'ye taşı
    const x1 = parseFloat(point1.style.left);
    const y1 = parseFloat(point1.style.top);
    const x2 = parseFloat(point2.style.left);
    const y2 = parseFloat(point2.style.top);

    // Rotasyon ve uzunluk. Burayı chat gpt yaptı :D 
    line.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px'; 
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';

    const lineId = line.id;  //bu line unique id ata
    const startId = point1.id;
    const endId = point2.id;
    lineList.push({ id: lineId, middlePoint: startId, endPoint: endId });

    container.appendChild(line);
}



function updateList() {
    const coordinateList = document.getElementById('coordinateList');
    coordinateList.innerHTML = ''; // Liste içeriğini temizle

    const points = document.querySelectorAll('.point');
    points.forEach(function (point) {
        const coordinateItem = document.createElement('li');
        coordinateItem.textContent = `Point ID: ${point.id}, X: ${point.style.left}, Y: ${point.style.top}`;
        coordinateList.appendChild(coordinateItem);
    });
}

function calculateDistance(point1, point2) {
    if (!point1 || !point2) {
        return 0; // Nokta sayısı yetersizse uzaklığı 0 olarak döndür
    }

    const x1 = parseFloat(point1.style.left);
    const y1 = parseFloat(point1.style.top);
    const x2 = parseFloat(point2.style.left);
    const y2 = parseFloat(point2.style.top);

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
}
