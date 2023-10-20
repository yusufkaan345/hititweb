var addingTrianglePoint = false; // Üçgen eklemek için kullanılacak değişken
var addingLinePoint = false;   // Çizgi eklemek için kullanıclacak değişken

const pointTriangleList = []; // Üçgen nokta koordinatlarını saklamak için bir dizi
const pointTriangleListTrash = [];
const pointLineList = [];    // Çizgi nokta koordinatlarını saklamak için bir dizi
const pointLineListTrash = [];

const pointTriangleSets = []; // Üçgen nokta kümelerini saklamak için bir dizi.Yani bir üçgen oluşturulduğunda dizi olarak tüm koordinatlar bunun içinde olacak 
const pointLineSets = [];     // Çizgi nokta kümelerini saklamak için kullanılacak dizi
const pointSets = [];         // Üçgen ve çizgilerden oluşan bir harf seti. Save bastığında setler içerisindeki nokta ve çizgileri alıp bu son liste içerisinde o heceyi saklayacak
const wordSets = [];          //hecelerden oluşan kelimeleri sakladığımız yer
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

const cancelButton = document.getElementById('cancelButton'); // Cancel işlemleri olacak 

var zoomInButton = document.getElementById("zoomInButton");
var zoomOutButton = document.getElementById("zoomOutButton");
var zoomLevel = 1;

zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);

document.getElementById('nextButton').addEventListener('click', loadNextImage);
document.getElementById('prevButton').addEventListener('click', loadPrevImage);
document.getElementById('addSyllable').addEventListener('click', addSyllableCardToList);
document.getElementById('addWordBtn').addEventListener('click', addWordCard);


document.getElementById('addTriangleBtn').addEventListener('click', function () {
    addingTrianglePoint = true; // add triangle butonuna tıklandığında eklemeye başlayın
    addingLinePoint = false;
});

document.getElementById('addLineBtn').addEventListener('click', function () {
    addingLinePoint = true; // add line butonuna tıklandığında eklemeye başlayın
    addingTrianglePoint = false;
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



        // Çizginin eklenen noktası üçgenin hangi noktasına yakın for ile kontrol et
        if (pointLineList.length === 0) {
            let closestTrianglePoint = null; // En yakın üçgen noktasını saklamak için değişken
            let minDistance = Number.MAX_VALUE; // En küçük mesafeyi saklamak için değişken

            for (const triangleSet of pointTriangleSets) {
                for (const trianglePoint of triangleSet) {
                    if (!trianglePoint.connected) {
                        const distance = Math.sqrt(
                            Math.pow(parseFloat(point.dataset.originalX) - parseFloat(trianglePoint.x), 2) +
                            Math.pow(parseFloat(point.dataset.originalY) - parseFloat(trianglePoint.y), 2)
                        );

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestTrianglePoint = trianglePoint;
                        }
                    }
                }
            }

            if (closestTrianglePoint) {
                point.dataset.originalX = closestTrianglePoint.x;
                point.dataset.originalY = closestTrianglePoint.y;
                point.style.backgroundColor = 'pink';
                closestTrianglePoint.connected = true; // Bağlantıyı işaretle
            }
        }

        pointLineList.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY });
        container.appendChild(point);

        if (pointLineList.length == 2) {
            const firstPoint = pointLineList[0];
            const secondPoint = pointLineList[1];

            drawLine(document.getElementById(firstPoint.id), document.getElementById(secondPoint.id));

            const newPointSet = pointLineList.slice();
            pointLineSets.push(newPointSet);
            addingLinePoint = false;
            pointLineList.forEach(item => pointLineListTrash.push(item))
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
                pointTriangleList.forEach(item => pointTriangleListTrash.push(item))
                pointTriangleList.length = 0
            }
        }
        if (syllableList.length>0) {
            // Eğer syllableList dolu ise bu kısmı çalıştır
            const syllableListIds = syllableList.map(item => item.id);
    
            pointLineListTrash = pointLineListTrash.filter(item => !syllableListIds.includes(item.id));
            pointTriangleListTrash = pointTriangleListTrash.filter(item => !syllableListIds.includes(item.id));
        }
    }

    updateLabelPositions();
});

cancelButton.addEventListener('click', function () {
    for (const point of pointLineListTrash) {
        const pointElement = document.getElementById(point.id);
        if (pointElement) {
            pointElement.remove(); // Noktayı container'dan sil
        }
    }
    for (const line of lineList) {
        const lineElement = document.getElementById(line.id);
        if (lineElement) {
            lineElement.remove(); // Çizgiyi container'dan sil
        }
    }

    // Silmek istediğiniz üçgen noktalarını ve çizgileri burada silin
    for (const point of pointTriangleListTrash) {
        const pointElement = document.getElementById(point.id);
        if (pointElement) {
            pointElement.remove(); // Noktayı container'dan sil
        }
    }

    // Silme işleminden sonra dizileri temizleyin
    lineList.length = 0;
    connectedPoints.length = 0;
    pointTriangleList.length = 0;
    pointTriangleSets.length = 0;
    pointLineSets.length = 0;

    addingLinePoint = false;
    addingTrianglePoint = false;

});

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
function addSyllableCardToList() {
    pointLineList.length = 0
    pointTriangleList.length = 0;

    var heceIsmi = document.getElementById('hece_ismi').value;
    var selectedRadioValue = getSelectedRadioValue('uygarlik');
    if (heceIsmi == "" || selectedRadioValue == "") {
        alert("Hece ismi ve uygarlik seçilmeli")
    }
    if( (pointTriangleSets.length <= 0 && pointLineSets.length <= 0)){
        alert("Yeni bir Üçgen veya Çizgi eklenmedi ")
    }
    else if (heceIsmi != "" && selectedRadioValue != "" && (pointTriangleSets.length > 0 || pointLineSets.length > 0)) {
        var syllableList = [];

        for (const triangleSet of pointTriangleSets) {
            for (const point of triangleSet) {
                if (!syllableList.some(item => item.x === point.x && item.y === point.y && item.id === point.id)) {
                    syllableList.push({ id: point.id, x: point.x, y: point.y });
                    removeFromTrash(point, pointTriangleListTrash); // Noktayı trash'ten kaldır

                }
            }
        }

        for (const lineSet of pointLineSets) {
            for (const point of lineSet) {
                if (!syllableList.some(item => item.x === point.x && item.y === point.y && item.id === point.id)) {
                    syllableList.push({ id: point.id, x: point.x, y: point.y });
                    removeFromTrash(point, pointLineListTrash); // Noktayı trash'ten kaldır

                }
            }
        }
        for (const line of lineList) {
            syllableList.push(line)
        }

        const heceName = {
            heceismi: heceIsmi, // Anahtar: Değer
        };
        const selectedValue = {
            selectedRadioValue: selectedRadioValue, // Anahtar: Değer
        };
        syllableList.push(heceName);
        syllableList.push(selectedValue);
        pointSets.push(syllableList)
        pointTriangleSets.length = 0;
        pointLineSets.length = 0;

        const successAlert = document.getElementById("successAlert");
        successAlert.style.display = "block"; // Mesajı görüntüle
        setTimeout(function () {
            successAlert.style.display = "none"; // 2 saniye sonra gizle
        }, 2000); // 2 saniye = 2000 milisaniye
        lineList.length = 0;


        updatesyllableList(); // Koordinat listesini güncelle

        //listeyi temizle radio button unchecked yap
        document.getElementById('hece_ismi').value = ""
        var radioButtons = document.getElementsByName("uygarlik");
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].checked = false;
        }


    }


}
function removeFromTrash(point, trash) {
    const index = trash.findIndex(item => item.id === point.id);
    if (index !== -1) {
        trash.splice(index, 1); // Noktayı trash'ten kaldır
    }
}
function updatesyllableList() {
    const syllableList = document.getElementById('syllableList');
    syllableList.innerHTML = ''; // Önce mevcut listeyi temizle

    pointSets.forEach(function (pointSet, index) {

        const filteredPointSet = pointSet.filter(point => point.hasOwnProperty('x') && point.hasOwnProperty('y'));
        const heceIsmi = pointSet.find(point => point.hasOwnProperty('heceismi'))?.heceismi || "";
        const selectedRadioValue = pointSet.find(point => point.hasOwnProperty('selectedRadioValue'))?.selectedRadioValue || "";

        if (filteredPointSet.length > 0) {

            const card = document.createElement('li');
            card.innerHTML = `
                <div class="card mr-3"  style="width:175px; height:100px;  " >
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

function addWordCard() {
    const wordList = document.getElementById('wordList');
    const kelimeIsmi = document.getElementById('kelime_ismi').value;
  
    if (pointSets.length > 0 && kelimeIsmi != "") {
        // PointSets'teki tüm hece listelerini tek bir liste öğesi olarak wordSets'e ekle
        wordSets.push({ kelime: kelimeIsmi, heceList: [...pointSets] });
        // PointSets'i temizle
        pointSets.length = 0;

        // Hece listesini temizle
        const syllableList = document.getElementById('syllableList');
        syllableList.innerHTML = '';

        // Kelime kartlarını oluştur ve listeye ekle
        wordList.innerHTML = ''; // Önce mevcut kelime kartlarını temizle

        wordSets.forEach(function (word, index) {
            var card = document.createElement('li');
            card.classList.add('wordCard');
            const heceListItems = word.heceList.map((hece, heceIndex) => `
            
                <li>Hece ${heceIndex + 1}: Hece İsmi: ${hece[hece.length - 2].heceismi}, Dil: ${hece[hece.length - 1].selectedRadioValue}</li>
            `).join('');

            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6>Kelime: ${word.kelime}</h6>
                        <ul>
                            ${heceListItems}
                        </ul>
                        <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCardKelime(${index})">Delete</button> 
                    </div>
                </div>
            `;
            wordList.appendChild(card);
                    console.log(wordSets)

            //input alanını temizleme
            document.getElementById('kelime_ismi').value = ""
        });
    }
}
function deleteCardKelime(index) {
    if (index >= 0 && index < wordSets.length) {
        
        const deletedItems = wordSets[index].heceList;
       
        // Silinecek noktaları ve çizgileri container üzerinden sil
        deletedItems.forEach(item => {

            item.forEach(deleteItem => {
                if (deleteItem.hasOwnProperty('x') && deleteItem.hasOwnProperty('y')) {
                    const pointElement = document.getElementById(deleteItem.id);

                    if (pointElement) {
                        pointElement.remove(); // Noktayı container'dan sil
                    }
                } else if (deleteItem.hasOwnProperty('startPoint') && deleteItem.hasOwnProperty('endPoint')) {
                    const lineElement = document.getElementById(deleteItem.id);
                    if (lineElement) {
                        lineElement.remove(); // Çizgiyi container'dan sil
                    }
                }
            })

        });

        // Kelime kartını listeden kaldır
        wordSets.splice(index, 1);        

        const wordList = document.getElementById('wordList');
        const cards = wordList.querySelectorAll('.wordCard');
       
        if (cards[index]) {
            cards[index].remove();
        }

        // Listeyi güncelle
        addWordCard();
    }
}
