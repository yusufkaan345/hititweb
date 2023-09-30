let addingPoint = false; // Nokta eklemek için kullanılacak değişken
const pointList = []; // Noktaların koordinatlarını saklamak için bir dizi
const pointSets = []; // Nokta kümelerini saklamak için bir dizi
let lineList= [];
let lineCounter = 0; // Çizgiye benzersiz bir id atamak için sayaç
let dotCounter=0;

document.getElementById('addTriangleBtn').addEventListener('click', function () {
    addingPoint = true; // add Nokta butonuna tıklandığında eklemeye başlayın
    pointList.length = 0; // Yeni küme için nokta listesini temizle
});

const container = document.getElementById('container-image'); //htmldeki imageyi alma
container.addEventListener('click', function (event) {
    if (addingPoint) {
        const point = document.createElement('div'); //noktayı bir div elementi olarak oluşturur.
        const pointId = `point-${dotCounter}`; // Benzersiz bir ID oluştur
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.style.left = (event.clientX - container.getBoundingClientRect().left) + 'px';
        point.style.top = (event.clientY - container.getBoundingClientRect().top) + 'px';

        // Noktanın koordinatlarını diziye ekle
        pointList.push({ id: pointId, x: point.style.left, y: point.style.top });

        // Yeni noktayı tıkladığınızda koordinat listesine ekleyin
        point.addEventListener('click', updateList);
        container.appendChild(point);
        updateList(); // Liste güncelleme fonksiyonunu çağırın

        // En az iki nokta varsa çizgi çiz
        if (pointList.length >= 2) {
            const firstPoint = pointList[0]; 
            const startPoint = pointList[pointList.length - 2]; // İkinci en son nokta
            const endPoint = pointList[pointList.length - 1]; // En son nokta

            drawLine(document.getElementById(startPoint.id), document.getElementById(endPoint.id));
            // İlk ve son nokta arasındaki mesafeyi hesapla
            const distance = calculateDistance(document.getElementById(firstPoint.id), document.getElementById(endPoint.id));

            if (distance < 25 && pointList.length > 2 ) {
                drawLine(document.getElementById(firstPoint.id), document.getElementById(endPoint.id));
                addingPoint = false;

                // Noktaları yeni bir küme olarak kabul et
                const newPointSet = pointList.slice();
                pointSets.push(newPointSet);
                pointList.length = 0; // Nokta listesini temizle
                console.log(pointSets);
            }
        }
    }
});

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

function drawLine(point1, point2) {
    const line = document.createElement("div");
    line.className = 'line'
    line.id=`line-${lineCounter}`
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

    // Rotation and length
    line.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';

    const lineId = line.id;
    const startId = point1.id;
    const endId = point2.id;
    lineList.push({ id: lineId, startPoint: startId, endPoint: endId });
    console.log(lineList);

    container.appendChild(line);
}
