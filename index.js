var addingTrianglePoint = false; // Üçgen eklemek için kullanılacak değişken
var addingLinePoint = false;   // Çizgi eklemek için kullanıclacak değişken

const pointTriangleList = []; // Üçgen nokta koordinatlarını saklamak için bir dizi
const pointLineList = [];    // Çizgi nokta koordinatlarını saklamak için bir dizi

const pointTriangleSets = []; // Üçgen nokta kümelerini saklamak için bir dizi.Yani bir üçgen oluşturulduğunda dizi olarak tüm koordinatlar bunun içinde olacak 
const pointLineSets = [];     // Çizgi nokta kümelerini saklamak için kullanılacak dizi
const pointSets = [];         // Üçgen ve çizgilerden oluşan bir harf seti. Save bastığında setler içerisindeki nokta ve çizgileri alıp bu son liste içerisinde o heceyi saklayacak

const container = document.getElementById('container-image');

var lineList = []; //eklenen her bir çizgiyi kaydettiğimiz yer . Su an çizgilerle bir işimiz yok ama yinede bir id ile kaydettim hepsini.
var lineCounter = 0; // Çizgiye benzersiz bir id atamak için sayaç
var dotCounter = 0; // Noktaya benzersiz id atamak için sayaç

const MIN_DISTANCE_THRESHOLD = 10; // Eklenen çizgi  ile üçgen noktalarının koordinatları arasındaki mesafe bundan küçükse 

const totalImages = 3;
var currentImageIndex = 1;

var tablet = document.getElementById("tablet");
var originalImageWidth = tablet.width;
var originalImageHeight = tablet.height;

const initialImage = document.getElementById('tablet');
tablet.src = 'img/tablet1.jpeg';

function loadNextImage() {
    currentImageIndex++;
    if (currentImageIndex > totalImages) {
        currentImageIndex = 1;
    }
    const image = document.getElementById('tablet');
    image.src = `img/tablet${currentImageIndex}.jpeg`;
}

function loadPrevImage() {
    currentImageIndex--;
    if (currentImageIndex < 1) {
        currentImageIndex = totalImages;
    }
    const image = document.getElementById('tablet');
    image.src = `img/tablet${currentImageIndex}.jpeg`;
}

document.getElementById('nextButton').addEventListener('click', loadNextImage);
document.getElementById('prevButton').addEventListener('click', loadPrevImage);

var zoomInButton = document.getElementById("zoomInButton");
var zoomOutButton = document.getElementById("zoomOutButton");
var zoomLevel = 1;

zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);

function zoomIn() {
    zoomLevel += 0.1;
    tablet.style.transform = `scale(${zoomLevel})`;
    updateLabelPositions();
    updateOriginalCoordinates();
}

function zoomOut() {
    if (zoomLevel > 0.2) {
        zoomLevel -= 0.1;
        tablet.style.transform = `scale(${zoomLevel})`;
        updateLabelPositions();
        updateOriginalCoordinates();
    }
}

function updateOriginalCoordinates() {
    const points = document.querySelectorAll('.point');
    points.forEach(function (point) {
        const newX = parseFloat(point.style.left) / zoomLevel;
        const newY = parseFloat(point.style.top) / zoomLevel;
        point.dataset.originalX = newX;
        point.dataset.originalY = newY;
    });
}

function updateLabelPositions() {
    const points = document.querySelectorAll('.point');
    points.forEach(function (point) {
        const originalX = parseFloat(point.dataset.originalX);
        const originalY = parseFloat(point.dataset.originalY);
        const newX = originalX * zoomLevel;
        const newY = originalY * zoomLevel;
        point.style.left = newX + 'px';
        point.style.top = newY + 'px';
    });
    updateLinePositions();
    updateList();
}

function updateLinePositions() {
    const lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        const startId = line.dataset.startPoint;
        const endId = line.dataset.endPoint;
        const start = document.getElementById(startId);
        const end = document.getElementById(endId);

        const x1 = parseFloat(start.dataset.originalX) * zoomLevel;
        const y1 = parseFloat(start.dataset.originalY) * zoomLevel;
        const x2 = parseFloat(end.dataset.originalX) * zoomLevel;
        const y2 = parseFloat(end.dataset.originalY) * zoomLevel;

        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';

        line.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
        line.style.transformOrigin = '0 0';
        line.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';
    });
}

document.getElementById('addTriangleBtn').addEventListener('click', function () {
    addingTrianglePoint = true; // add triangle butonuna tıklandığında eklemeye başlayın
    addingLinePoint = false;
});

document.getElementById('addLineBtn').addEventListener('click', function () {
    addingLinePoint = true; // add line butonuna tıklandığında eklemeye başlayın
    addingTrianglePoint = false;
});

/*
function mergeClosePoints(newPoint, pointSets) {
    for (const pointSet of pointSets) {
        for (const existingPoint of pointSet) {
            const distance = Math.sqrt(
                Math.pow(parseFloat(newPoint.style.left) - parseFloat(existingPoint.x), 2) +
                Math.pow(parseFloat(newPoint.style.top) - parseFloat(existingPoint.y), 2)
            );

            if (distance <= MIN_DISTANCE_THRESHOLD) {
                newPoint.style.left = existingPoint.x;
                newPoint.style.top = existingPoint.y;
                newPoint.parentNode.removeChild(newPoint);
                return;
            }
        }
    }
}
*/


container.addEventListener('click', function (event) {
    const containerRect = container.getBoundingClientRect();
    const scrolledX = event.clientX - containerRect.left + container.scrollLeft;
    const scrolledY = event.clientY - containerRect.top + container.scrollTop;

    if (addingLinePoint) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.dataset.originalX = (scrolledX) / zoomLevel;
        point.dataset.originalY = (scrolledY) / zoomLevel;

        //mergeClosePoints(point, [...pointLineSets, ...pointTriangleSets]);

        pointLineList.push({ id: pointId, x: point.style.left, y: point.style.top });
        container.appendChild(point);

        if (pointLineList.length == 2) {
            const firstPoint = pointLineList[0];
            const secondPoint = pointLineList[1];

            drawLine(document.getElementById(firstPoint.id), document.getElementById(secondPoint.id));
            addingLinePoint = false;

            const newPointSet = pointLineList.slice();
            pointLineSets.push(newPointSet);
            pointLineList.length = 0;
        }
    }

    if (addingTrianglePoint) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.dataset.originalX = (scrolledX) / zoomLevel;
        point.dataset.originalY = (scrolledY) / zoomLevel;

        //mergeClosePoints(point, [...pointLineSets, ...pointTriangleSets]);

        pointTriangleList.push({ id: pointId, x: point.style.left, y: point.style.top });

        container.appendChild(point);

        if (pointTriangleList.length >= 2) {
            const firstPoint = pointTriangleList[0];
            const middlePoint = pointTriangleList[pointTriangleList.length - 2];
            const endPoint = pointTriangleList[pointTriangleList.length - 1];

            drawLine(document.getElementById(middlePoint.id), document.getElementById(endPoint.id));

            if (pointTriangleList.length == 3) {
                drawLine(document.getElementById(firstPoint.id), document.getElementById(endPoint.id));

                addingTrianglePoint = false;

                const newPointSet = pointTriangleList.slice();
                pointTriangleSets.push(newPointSet);
                pointTriangleList.length = 0;
            }
        }
    }

    updateLabelPositions();
});

function drawLine(point1, point2) {
    const line = document.createElement("div");
    line.className = 'line'
    line.id = `line-${lineCounter}`
    lineCounter++;

    //to zoom in and out case
    line.dataset.startPoint = point1.id;
    line.dataset.endPoint = point2.id;

    line.style.position = "absolute";
    line.style.border = "0.2px solid white";
    line.style.backgroundColor = "white";
    line.style.width = "0.2px";
    line.style.height = "0.2px";

    // Çizgiyi point1'den point2'ye taşı 
    const x1 = parseFloat(point1.dataset.originalX);
    const y1 = parseFloat(point1.dataset.originalY);
    const x2 = parseFloat(point2.dataset.originalX);
    const y2 = parseFloat(point2.dataset.originalY);

    line.style.left = x1 + 'px'; // Başlangıç noktasını point1'in x koordinatına ayarla
    line.style.top = y1 + 'px'; // Başlangıç noktasını point1'in y koordinatına ayarla

    // Rotasyon ve uzunluk. Burayı chat gpt yaptı :D 
    line.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';

    const lineId = line.id; //bu line unique id ata
    const startId = point1.id;
    const endId = point2.id;
    lineList.push({ id: lineId, middlePoint: startId, endPoint: endId });

    container.appendChild(line);
}

function updateList() {
    const coordinateList = document.getElementById('coordinateList');
    coordinateList.innerHTML = ''; // Liste içeriğini temizle

    //merge işlemleri

    const points = document.querySelectorAll('.point');
    points.forEach(function (point) {
        const coordinateItem = document.createElement('li');
        coordinateItem.textContent = `Point ID: ${point.id}, X: ${point.style.left}, Y: ${point.style.top}`;
        coordinateList.appendChild(coordinateItem);
    });
}

//TO-DO: nokta ve çizgiler eşleşmeli