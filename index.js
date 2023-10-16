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
const connectedPoints = [];

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
document.getElementById('addSyllable').addEventListener('click', addSyllableCardToList);

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

        line.style.left = (x1 + 2.4) + 'px';
        line.style.top = (y1 + 2.4) + 'px';

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


const cancelButton = document.getElementById('cancelButton'); // Cancel işlemleri olacak 
cancelButton.addEventListener('click', function () {
    
});

 


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


        let pointConnected = false; // Bu noktanın bağlantısı var mı?
        let closestTrianglePoint = null; // En yakın üçgen noktasını saklamak için değişken. Eklenecek çizgi noktası herhangi iki noktayada 10 brden az mesafedeyse en yakınını bulmak için 

        for (const triangleSet of pointTriangleSets) {
            for (const trianglePoint of triangleSet) {
                if (!trianglePoint.connected) {
                    const distance = Math.sqrt(
                        Math.pow(parseFloat(point.dataset.originalX) - parseFloat(trianglePoint.x), 2) +
                        Math.pow(parseFloat(point.dataset.originalY) - parseFloat(trianglePoint.y), 2)
                    );

                    if (distance <= MIN_DISTANCE_THRESHOLD) {
                        if (!closestTrianglePoint || distance < closestTrianglePoint.distance) {
                            closestTrianglePoint = {
                                point: trianglePoint,
                                distance: distance
                            };
                        }
                    }
                }
            }
        }

        if (closestTrianglePoint) {
            point.dataset.originalX = closestTrianglePoint.point.x;
            point.dataset.originalY = closestTrianglePoint.point.y;
            point.style.backgroundColor = 'red';
            closestTrianglePoint.point.connected = true; // Bağlantıyı işaretle
            pointConnected = true; // Bu noktanın bağlantısı olduğunu işaretle
        }

        if (pointConnected) {
            connectedPoints.push(point); // Bağlantı yapılan noktayı diziye ekleyin
        }
        pointLineList.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY, color: 'pink' });
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


        pointTriangleList.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY });


        container.appendChild(point);

        if (pointTriangleList.length >= 2) {
            const firstPoint = pointTriangleList[0];
            const startPoint = pointTriangleList[pointTriangleList.length - 2];
            const endPoint = pointTriangleList[pointTriangleList.length - 1];

            drawLine(document.getElementById(startPoint.id), document.getElementById(endPoint.id));

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

    line.style.left = (x1 + 2.4) + 'px'; // Başlangıç noktasını point1'in x koordinatına ayarla
    line.style.top = (y1 + 2.4) + 'px'; // Başlangıç noktasını point1'in y koordinatına ayarla

    // Rotasyon ve uzunluk. Burayı chat gpt yaptı :D 
    line.style.width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) + 'px';
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + Math.atan2(y2 - y1, x2 - x1) + 'rad)';

    const lineId = line.id; //bu line unique id ata
    const startId = point1.id;
    const endId = point2.id;
    lineList.push({ id: lineId, startPoint: startId, endPoint: endId });

    container.appendChild(line);
}

function addSyllableCardToList() {
    var heceIsmi = document.getElementById('hece_ismi').value;
    var selectedRadioValue = getSelectedRadioValue('uygarlik');
    if (heceIsmi == "" || selectedRadioValue == "") {
        alert("Hece ismi ve uygarlık seçilmeli")
    }
    else if (heceIsmi != "" && selectedRadioValue != "" && (pointTriangleSets.length > 0 || pointLineSets.length > 0)) {
        var syllableList = [];

        for (const triangleSet of pointTriangleSets) {
            for (const point of triangleSet) {
                if (!syllableList.some(item => item.x === point.x && item.y === point.y && item.id === point.id)) {
                    syllableList.push({ id: point.id, x: point.x, y: point.y });
                }
            }
        }

        for (const lineSet of pointLineSets) {
            for (const point of lineSet) {
                if (!syllableList.some(item => item.x === point.x && item.y === point.y && item.id === point.id)) {
                    syllableList.push({ id: point.id, x: point.x, y: point.y });
                }
            }
        }
        for (const line of lineList) {
            syllableList.push(line)
        }
        pointSets.push(syllableList)
        pointTriangleSets.length = 0;
        pointLineSets.length = 0;

        const successAlert = document.getElementById("successAlert");
        successAlert.style.display = "block"; // Mesajı görüntüle
        setTimeout(function () {
            successAlert.style.display = "none"; // 2 saniye sonra gizle
        }, 2000); // 2 saniye = 2000 milisaniye
        lineList.length = 0;


        updatesyllableList(heceIsmi, selectedRadioValue); // Koordinat listesini güncelle

        //listeyi temizle radio button unchecked yap
        document.getElementById('hece_ismi').value = ""
        var radioButtons = document.getElementsByName("uygarlik");
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].checked = false;
        }


    }


}
function updatesyllableList(heceIsmi, selectedRadioValue) {
    const syllableList = document.getElementById('syllableList');
    syllableList.innerHTML = ''; // Önce mevcut listeyi temizle

    pointSets.forEach(function (pointSet, index) {

        const filteredPointSet = pointSet.filter(point => point.hasOwnProperty('x') && point.hasOwnProperty('y'));

        if (filteredPointSet.length > 0) {
            const card = document.createElement('li');
            card.className = 'list-group-item';
            // Radio düğmesi değerini al

            card.innerHTML = `
                <div class="card">
                    
                        <h6 style="font-size:12px;">Hece Seti ${index + 1}</h6>
                        <div style="font-size:12px;">Hece İsmi : ${heceIsmi}</div>
                        <div style="font-size:12px;"> Dil : ${selectedRadioValue}</div>
                        <button class="btn-danger"  style="width:50px; height:20px; font-size:10px" onclick="deleteCard(${index})">Delete</button>
                    
                </div>
            `;

            syllableList.appendChild(card);
        }

    });
}
function getSelectedRadioValue(name) {
    const radioButtons = document.getElementsByName(name);
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
    return "";
}

function deleteCard(index) {
    const deletedItems = pointSets[index];

    // Silinecek noktaları ve çizgileri container üzerinden sil
    deletedItems.forEach(item => {
        if (item.hasOwnProperty('x') && item.hasOwnProperty('y')) {
            const pointElement = document.getElementById(item.id);
            if (pointElement) {
                pointElement.remove(); // Noktayı containerdan sil
            }
        } else if (item.hasOwnProperty('startPoint') && item.hasOwnProperty('endPoint')) {
            const lineElement = document.getElementById(item.id);
            if (lineElement) {
                lineElement.remove(); // Çizgiyi containerdan sil
            }
        }
    });

    // Belirli bir "card" ı listeden kaldır
    pointSets.splice(index, 1);

    // Listeyi güncelle
    updatesyllableList();
}