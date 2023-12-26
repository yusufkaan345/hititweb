var isAdd4Manuel = false; // Üçgen eklemek için kullanılacak değişken
var isAdd5Manuel = false; // Çizgi eklemek için kullanıclacak değişken
var isAdd4 = false
var isAdd5 = false

const pointManuel4 = []; // Üçgen nokta koordinatlarını saklamak için bir dizi
const pointManuel4Trash = []; //İptal durumunda boşaltılacak liste
const pointManuel5 = []; // Çizgi nokta koordinatlarını saklamak için bir dizi
const pointManuel5Trash = [];
var pointTempleList = []; //Şablon ekleme 4 nokta


const pointManuel4Sets = []; // Üçgen nokta kümelerini saklamak için bir dizi.Yani bir üçgen oluşturulduğunda dizi olarak tüm koordinatlar bunun içinde olacak 
const pointManuel5Sets = []; // Çizgi nokta kümelerini saklamak için kullanılacak dizi
var pointTemple4 = [];    // 4Lü nokta setini saklamak için dizi
var pointTemple5 = [];    // 5li nokta setini saklamak için dizi 

const pointSets = []; // Üçgen ve çizgilerden oluşan bir harf seti. Save bastığında setler içerisindeki nokta ve çizgileri alıp bu son liste içerisinde o heceyi saklayacak
const wordSets = []; //hecelerden oluşan kelimeleri sakladığımız yer
const sentenceSets = []

const container = document.getElementById('container-image');

var trashLine = [];

var lineList = []; //eklenen her bir çizgiyi kaydettiğimiz yer . Su an çizgilerle bir işimiz yok ama yinede bir id ile kaydettim hepsini.
var lineCounter = 0; // Çizgiye benzersiz bir id atamak için sayaç
var dotCounter = 0; // Noktaya benzersiz id atamak için sayaç
var groupCounter = 0; // Template dotlara grup atamak için sayaç

const totalImages = 3;
var currentImageIndex = 1;

var tablet = document.getElementById("tablet");
var originalImageWidth = tablet.width;
var originalImageHeight = tablet.height;

const initialImage = document.getElementById('tablet');
tablet.src = 'img/tablet1.jpeg';

const cancelButton = document.getElementById('cancelButton');

var zoomInButton = document.getElementById("zoomInButton");
var zoomOutButton = document.getElementById("zoomOutButton");
var rotateButton=document.getElementById("rotateButton")

rotateButton.addEventListener('click', function () {
    if (selectedGroup) { rotateGroup(selectedGroup); }
});

function rotateGroup(group) {
    // Grubun tüm elemanlarını bul
    var dots = document.querySelectorAll('.point[data-group="' + group +'"]');
    var lines = document.querySelectorAll('.line[data-group="' + group +'"]');
    console.log(lines)
    if (dots.length > 1 && selectedDot) {
        // Seçili noktanın konumunu al
        var x1 = parseFloat(selectedDot.style.left);
        var y1 = parseFloat(selectedDot.style.top);

        // Diğer noktaları döndür ve çizgileri güncelle
        for (var i = 0; i < dots.length; i++) {
            var dot = dots[i];
            var x = parseFloat(dot.style.left);
            var y = parseFloat(dot.style.top);

            var angle = Math.atan2(y - y1, x - x1) * (180 / Math.PI);
            var newAngle = angle + 60;

            // Yeni konumu hesapla
            var distance = Math.sqrt(Math.pow((x - x1), 2) + Math.pow((y - y1), 2));
            var newX = x1 + distance * Math.cos(newAngle * (Math.PI / 180));
            var newY = y1 + distance * Math.sin(newAngle * (Math.PI / 180));

            dot.style.left = newX + 'px';
            dot.style.top = newY + 'px';

            dot.dataset.originalX=newX;
            dot.dataset.originalY=newY
        }
        // Çizgileri güncelle
        lines.forEach(line => {
            var deleteLine=document.getElementById(line.id)
            if (deleteLine) {  deleteLine.remove(); }
        });       
        for (var j = 0; j < lines.length; j++) {
            var startDotId = lines[j].dataset.startPoint;
            var endDotId = lines[j].dataset.endPoint;
            console.log(document.getElementById(startDotId).dataset.originalX ,document.getElementById(startDotId).style.le )
            drawLine(document.getElementById(startDotId), document.getElementById(endDotId), group);
        }
    }
}
var zoomLevel = 1;

var selectedDot = null; // Seçilen noktanın referansını tutacak değişken
var selectedGroup = null; //Seçilen nokta template ise onun bağlı olduğu noktaların grup listesi

var isMouseDown = false;

zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);

document.getElementById('nextButton').addEventListener('click', loadNextImage);
document.getElementById('prevButton').addEventListener('click', loadPrevImage);

var specialChars = document.querySelectorAll('.accent-cell');
specialChars.forEach(function (char) {
    char.addEventListener('click', specialCharCase);
});

document.getElementById('addSyllable').addEventListener('click', addSyllableCardToList);
document.getElementById('addWordBtn').addEventListener('click', addWordCard);
document.getElementById('addSentenceBtn').addEventListener('click', addSentenceCard)
document.getElementById('saveBtn').addEventListener('click', saveBtnConfirm)

function addButtonEventListener(btnId, flagName) {
    document.getElementById(btnId).addEventListener('click', function () {
        isAdd4Manuel = flagName === 'isAdd4Manuel';
        isAdd5Manuel = flagName === 'isAdd5Manuel';
        isAdd4 = flagName === 'isAdd4';
        isAdd5 = flagName === 'isAdd5';
    });
}
addButtonEventListener('addTriangleBtn', 'isAdd4Manuel');
addButtonEventListener('addLineBtn', 'isAdd5Manuel');
addButtonEventListener('add-4', 'isAdd4');
addButtonEventListener('add-5', 'isAdd5');

function addDot(x, y,group) {
   
    var point = document.createElement('div');
    point.className = 'point';
    point.style.left = x + 'px';
    point.style.top = y + 'px';
    point.style.backgroundColor='rgb(5, 250, 65)'
    point.dataset.originalX = (x) / zoomLevel;
    point.dataset.originalY = (y) / zoomLevel;
    if(group!=null){point.dataset.group = group;}
    point.id = 'point-' + dotCounter; // Dotlara unique ID atama
    dotCounter++;
    pointTempleList.push(point)
    container.appendChild(point);
}
container.addEventListener('click', function (event) {
    const containerRect = container.getBoundingClientRect();
    const scrolledX = event.clientX - containerRect.left + container.scrollLeft;
    const scrolledY = event.clientY - containerRect.top + container.scrollTop;
    const selectedPoint = event.target;
    // Sadece nokta elementlerini seç
    if (selectedPoint.classList.contains('point')) {
        // Seçilen noktanın rengini değiştir
        if (selectedDot) {
            selectedDot.style.backgroundColor = ''; // Önceki seçili noktanın rengini sıfırla
        }
        selectedDot = selectedPoint;
        selectGroup(selectedPoint.dataset.group);
        selectedDot.style.backgroundColor = '#c44dff'; // Yeni seçilen noktanın rengini değiştir

    }
   
    if (isAdd5Manuel) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.dataset.originalX = (scrolledX) / zoomLevel;
        point.dataset.originalY = (scrolledY) / zoomLevel;
        pointManuel5.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY });
        container.appendChild(point);

        if (pointManuel5.length == 3) {
            const thirdPoint = pointManuel5[pointManuel5.length - 1];
            const firstPoint = pointManuel5[pointManuel5.length - 2];
            const secondPoint = pointManuel5[pointManuel5.length - 3];

            drawLine(document.getElementById(firstPoint.id), document.getElementById(secondPoint.id));
            drawLine(document.getElementById(firstPoint.id), document.getElementById(thirdPoint.id));
            drawLine(document.getElementById(secondPoint.id), document.getElementById(thirdPoint.id));
        }
        if (pointManuel5.length == 5) {
            const fourthPoint = pointManuel5[pointManuel5.length - 2];
            const fifthPoint = pointManuel5[pointManuel5.length - 1];

            const closestPoints4 = findClosestPoints(fourthPoint, pointManuel5.slice(-5, -2));
            const closestPoints5 = findClosestPoints(fifthPoint, pointManuel5.slice(-5, -2));

            if (closestPoints4.length > 0 || closestPoints5.length > 0) {
                const closestPoint4 = closestPoints4[0];
                const closestPoint5 = closestPoints5[0];
                drawLine(document.getElementById(fourthPoint.id), document.getElementById(closestPoint4.id));
                if(closestPoint4.id== closestPoint5.id)
                {                
                    const closestPoint5 = closestPoints5[1];
                    drawLine(document.getElementById(fifthPoint.id), document.getElementById(closestPoint5.id));
                }
                else{ drawLine(document.getElementById(fifthPoint.id), document.getElementById(closestPoint5.id));}
            }
           
            const newPointSet = pointManuel5.slice();
            pointManuel5Sets.push(newPointSet);
            pointManuel5.forEach(item => pointManuel5Trash.push(item))
            pointManuel5.length = 0
            isAdd5Manuel = false;

            // pointManuel4Sets, pointManuel4Trash, ve pointManuel4 işlemleri...
        }
    }
    if (isAdd4) {
       
        addDot(scrolledX, scrolledY,groupCounter);        //orta nokta   1     
        addDot(scrolledX + 20, scrolledY - 10,groupCounter); // sağ yukarı 2           
        addDot(scrolledX - 20, scrolledY - 10,groupCounter);  //sol yukarı 3
        addDot(scrolledX, scrolledY + 40,groupCounter);     //alt nokta  4  


        const dot1 = document.getElementById('point-' + (dotCounter - 4)) //orta nokta    1  
        const dot2 = document.getElementById('point-' + (dotCounter - 3)) // sağ yukarı 2
        const dot3 = document.getElementById('point-' + (dotCounter - 2)) //sol yukarı  3
        const dot4 = document.getElementById('point-' + (dotCounter - 1)) //alt nokta   4  

        drawLine(dot1, dot2,groupCounter);
        drawLine(dot1, dot3,groupCounter);
        drawLine(dot1, dot4,groupCounter);
        drawLine(dot2, dot3,groupCounter);

        groupCounter++;
        const newPointSet = pointTempleList.map(point => ({
            id: point.id,
            x: point.style.left, // Assuming style.left gives the x-coordinate
            y: point.style.top, // Assuming style.top gives the y-coordinate
          }));
        
        pointTemple4.push(newPointSet);
        pointTempleList.length = 0;
        isAdd4 = false;

    }

    if (isAdd4Manuel) {
        const point = document.createElement('div');
        const pointId = `point-${dotCounter}`;
        point.id = pointId;
        dotCounter++;
        point.className = 'point';
        point.dataset.originalX = (scrolledX) / zoomLevel;
        point.dataset.originalY = (scrolledY) / zoomLevel;
        pointManuel4.push({ id: pointId, x: point.dataset.originalX, y: point.dataset.originalY });
        container.appendChild(point);

        if (pointManuel4.length == 3) {
            const thirdPoint = pointManuel4[pointManuel4.length - 1];
            const firstPoint = pointManuel4[pointManuel4.length - 2];
            const secondPoint = pointManuel4[pointManuel4.length - 3];

            drawLine(document.getElementById(firstPoint.id), document.getElementById(secondPoint.id));
            drawLine(document.getElementById(firstPoint.id), document.getElementById(thirdPoint.id));
            drawLine(document.getElementById(secondPoint.id), document.getElementById(thirdPoint.id));

        }
        if (pointManuel4.length == 4) {
            const fourthPoint = pointManuel4[pointManuel4.length - 1];
            const closestPoints = findClosestPoints(fourthPoint, pointManuel4.slice(-4, -1));
            if (closestPoints.length > 0) {
                const closestPoint = closestPoints[0];
                drawLine(document.getElementById(fourthPoint.id), document.getElementById(closestPoint.id));
            }

            const newPointSet = pointManuel4.slice();
            pointManuel4Sets.push(newPointSet);
            pointManuel4.forEach(item => pointManuel4Trash.push(item))
            pointManuel4.length = 0
            isAdd4Manuel = false;

            // pointManuel4Sets, pointManuel4Trash, ve pointManuel4 işlemleri...
        }

        if (syllableList.length > 0) {
            const syllableListIds = syllableList.map(item => item.id);
            pointManuel5Trash = pointManuel5Trash.filter(item => !syllableListIds.includes(item.id));
            pointManuel4Trash = pointManuel4Trash.filter(item => !syllableListIds.includes(item.id));
        }
    }
    

    if (isAdd5) {
     
        addDot(scrolledX - 20, scrolledY,groupCounter);     //1                             
        addDot(scrolledX, scrolledY - 10,groupCounter);     //2                         
        addDot(scrolledX, scrolledY + 10,groupCounter);     //3                     
        addDot(scrolledX + 20, scrolledY - 25,groupCounter);  //4                         
        addDot(scrolledX + 20, scrolledY + 25,groupCounter);  //5  

        const dot1 = document.getElementById('point-' + (dotCounter - 5))   //orta en sol
        const dot2 = document.getElementById('point-' + (dotCounter - 4)) //yukarı 1
        const dot3 = document.getElementById('point-' + (dotCounter - 3)) //aşağı 1
        const dot4 = document.getElementById('point-' + (dotCounter - 2)) //yukarı 2  
        const dot5 = document.getElementById('point-' + (dotCounter - 1)) //aşağı 2

        drawLine(dot1, dot2,groupCounter);
        drawLine(dot1, dot3,groupCounter);
        drawLine(dot2, dot3,groupCounter);
        drawLine(dot2, dot4,groupCounter);
        drawLine(dot3, dot5,groupCounter);

        groupCounter++;
        const newPointSet = pointTempleList.map(point => ({
            id: point.id,
            x: point.style.left, // Assuming style.left gives the x-coordinate
            y: point.style.top, // Assuming style.top gives the y-coordinate
          }));
        pointTemple5.push(newPointSet);
        pointTempleList.length = 0;
        isAdd5 = false;

    }
    updateLabelPositions();
});
function selectGroup(group) { selectedGroup = group; } //seçilen noktanın ait olduğu grup

function findClosestPoints(point, points) {
    const distances = points.map(p => ({
        id: p.id,
        distance: getDistance(point, p)
    }));

    distances.sort((a, b) => a.distance - b.distance);

    return distances.map(d => ({ id: d.id, distance: d.distance }));
}
// İki nokta arasındaki mesafeyi hesaplayan fonksiyon
function getDistance(point1, point2) {
    const x1 = parseFloat(point1.x);
    const y1 = parseFloat(point1.y);
    const x2 = parseFloat(point2.x);
    const y2 = parseFloat(point2.y);

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
//dizilerdeki öğeleri siliyor her öğe için ilgili DOM öğesi alınıp (varsa) kaldırılıyor.
cancelButton.addEventListener('click', function () {
    const removeElements = (elements) => {
        elements.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.remove();
            }
        });
    };

    removeElements(pointManuel5Trash);
    removeElements(lineList);
    removeElements(pointManuel4Trash);
    pointTemple4.forEach(item => {
        removeElements(item)
    })
    pointTemple5.forEach(item => {
        removeElements(item)
    })
    // Silme işleminden sonra dizileri temizleyin
    lineList.length = 0;
    pointManuel4.length = 0;
    pointManuel4Sets.length = 0;
    pointManuel5Sets.length = 0;
    pointTemple4.length=0;
    pointTemple5.length=0
    isAdd5Manuel = false;
    isAdd4Manuel = false;
    isAdd4=false;
    isAdd5=false

});
function saveTransactions() {
    if (sentenceSets.length == 0) {
        console.log("boş bu liste")
    }
    else {
        var jsonString = JSON.stringify(sentenceSets);
        console.log(jsonString);
    }
}
function changeImage(offset) {
    currentImageIndex += offset;
    if (currentImageIndex > totalImages) {
        currentImageIndex = 1; saveBtn
    } else if (currentImageIndex < 1) {
        currentImageIndex = totalImages;
    }
    const image = document.getElementById('tablet');
    image.src = `img/tablet${currentImageIndex}.jpeg`;
}
function loadNextImage() {
    changeImage(1);
}
function loadPrevImage() {
    changeImage(-1);
}
function changeZoom(zoomIncrement) {
    if ((zoomIncrement > 0 && zoomLevel < 2) || (zoomIncrement < 0 && zoomLevel > 0.2)) {
        zoomLevel += zoomIncrement;
        tablet.style.transform = `scale(${zoomLevel})`;
        updateLabelPositions();
        updateOriginalCoordinates();
    }
}
function zoomIn() {
    changeZoom(0.1);
}
function zoomOut() {
    changeZoom(-0.1);
}
//TO-DO: fonksiyona gerek var mı kontrol etmek gerekiyor - updateLabelPositions() yüzünden çakışma var mı gibisinden
function updateOriginalCoordinates() {
    const points = document.querySelectorAll('.point');
    points.forEach(function (point) {
        const newX = parseFloat(point.style.left) / zoomLevel;
        const newY = parseFloat(point.style.top) / zoomLevel;
        point.dataset.originalX = newX;
        point.dataset.originalY = newY;
    });
}
// Elementlerin konumunu günceller ve bu güncellemeyi etiket pozisyonlarıyla ve satır pozisyonlarıyla birlikte çağırır.
function updateLabelPositions() {
    updateElementPositions('.point'); // Belirli bir seçiciye göre elementlerin pozisyonunu günceller
    updateLinePositions(); // Satır pozisyonlarını günceller
}
function updateElementPositions(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        // Seçiciye göre elementleri alır ve her birinin pozisyonunu günceller
        const originalX = parseFloat(element.dataset.originalX);
        const originalY = parseFloat(element.dataset.originalY);
        const newX = originalX * zoomLevel;
        const newY = originalY * zoomLevel;
        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
    });
}
// Satır pozisyonlarını günceller
function updateLinePositions() {
    // Satır elementlerini alır ve her birinin pozisyonunu günceller
    const lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        const [x1, y1, x2, y2] = getLineCoordinates(line);
        setPositionAndTransform(line, x1, y1, x2, y2); // Satırın pozisyonunu ayarlar ve döndürür
    });
}
// İki nokta arasında bir çizgi oluşturur
function drawLine(point1, point2,group) {
    const line = document.createElement("div");
    line.className = 'line'
    line.id = `line-${lineCounter}`
    lineCounter++;
    //to zoom in and out case
    line.dataset.startPoint = point1.id;
    line.dataset.endPoint = point2.id;
    line.dataset.group = group;  
    line.style.cssText = `
    position: absolute;
    border: 0.2px solid white;
    background-color: white;
    width: 0.2px;
    height: 0.2px;
    `;
    const [x1, y1] = [parseFloat(point1.dataset.originalX), parseFloat(point1.dataset.originalY)-(0.2)];
    const [x2, y2] = [parseFloat(point2.dataset.originalX), parseFloat(point2.dataset.originalY)-(0.2)];

    setPositionAndTransform(line, x1, y1, x2, y2);

    const lineId = line.id;
    const startId = point1.id;
    const endId = point2.id;
    lineList.push({ id: lineId, startPoint: startId, endPoint: endId });

    container.appendChild(line);
}
// Verilen bir satırın başlangıç ve bitiş noktalarını alır ve onların koordinatlarını döndürür
function getLineCoordinates(line) {
    // Satırın başlangıç ve bitiş noktalarının id'lerini alır
    const startId = line.dataset.startPoint;
    const endId = line.dataset.endPoint;
    const start = document.getElementById(startId);
    const end = document.getElementById(endId);

    // Başlangıç ve bitiş noktalarının koordinatlarını hesaplar ve zoom seviyesine göre yeniden hesaplar
    const [x1, y1] = [parseFloat(start.dataset.originalX) * zoomLevel, parseFloat(start.dataset.originalY) * zoomLevel];
    const [x2, y2] = [parseFloat(end.dataset.originalX) * zoomLevel, parseFloat(end.dataset.originalY) * zoomLevel];

    return [x1, y1, x2, y2];
}
// İki nokta arasında bir çizginin konumunu ve dönüşümünü ayarlar
function setPositionAndTransform(line, x1, y1, x2, y2) {
    line.style.left = (x1 + 2.1) + 'px';
    line.style.top = (y1 + 2.2) + 'px';

    const [width, rotation] = calculateWidthAndRotation(x1, y1, x2, y2);

    line.style.width = width + 'px';
    line.style.transformOrigin = '0 0';
    line.style.transform = 'rotate(' + rotation + 'rad)';
}
function calculateWidthAndRotation(x1, y1, x2, y2) {
    const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const rotation = Math.atan2(y2 - y1, x2 - x1);
    return [width, rotation];
}
function specialCharCase(event) {
    var clickedChar = event.target.innerText;
    var heceIsmi = document.getElementById('hece_ismi');
    heceIsmi.value += clickedChar;
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
function removeFromTrash(point, trash) {
    const index = trash.findIndex(item => item.id === point.id);
    if (index !== -1) {
        trash.splice(index, 1); // Noktayı trash'ten kaldır
    }
}
// Click event to move the selected point
container.addEventListener('mousemove', function (event) {
    if (selectedDot && isMouseDown) {
        const containerRect = container.getBoundingClientRect();
        const scrolledX = event.clientX - containerRect.left + container.scrollLeft;
        const scrolledY = event.clientY - containerRect.top + container.scrollTop;

        // Calculate new original coordinates for the selected point
        const newOriginalX = scrolledX / zoomLevel;
        const newOriginalY = scrolledY / zoomLevel;

        // Update the dataset values for the selectedDot
        selectedDot.dataset.originalX = newOriginalX;
        selectedDot.dataset.originalY = newOriginalY;

        // Update the visual position of the selectedDot
        selectedDot.style.left = scrolledX + 'px';
        selectedDot.style.top = scrolledY + 'px';
      
    }
});
document.addEventListener('mousedown', function (event) {  isMouseDown = true;});

document.addEventListener('mouseup', function (event) {
    isMouseDown = false;
    if(selectedDot){
        updateLines(selectedDot);
    }
    
});
function updateLines(dot) {
    var dataGroup=dot.dataset.group;
    // Silinecek çizgileri tutan bir dizi
    var linesToRemove = [];
    // Yeniden çizilecek çizgileri tutan bir dizi
    var linesToRedraw = []
    // selectedDot ile bağlantılı çizgileri bul
    lineList.forEach(item => {
        if (item.endPoint === dot.id || item.startPoint === dot.id) {
            // Eğer çizgi daha önce eklenmediyse, ekleyin
            const existingLineIndex = linesToRedraw.findIndex(line =>
                (line.start === item.startPoint && line.end === item.endPoint) ||
                (line.start === item.endPoint && line.end === item.startPoint)
            );
            if (existingLineIndex === -1) {
                linesToRedraw.push({ start: item.startPoint, end: item.endPoint });
            }
            linesToRemove.push(item.id); // Çizgiyi silmek için ID'yi ekleyin
        }
    });
    // Her bir çizgiyi silelim
    linesToRemove.forEach(lineId => {
        const lineElement = document.getElementById(lineId);
        if (lineElement) {
            lineElement.remove();
        }
    });
    // Yeni koordinatlarla çizgileri çiz
    linesToRedraw.forEach(item => {
        const startDotId = item.start;
        const endDotId = item.end;
        drawLine(document.getElementById(startDotId), document.getElementById(endDotId),dataGroup); // Çizgiyi çiz
    });
    // linesToRedraw dizisini sıfırlayalım   
}
function addSyllableCardToList() {
    // Çöp kutusundaki çizgileri ve noktaları kaldırır
    lineList.forEach(line => {
        if (trashLine.includes(line.startPoint)) {
            const lineElement = document.getElementById(line.id);
            if (lineElement) lineElement.remove();
        }
    });
    pointManuel5.concat(pointManuel4).forEach(item => {
        const pointElement = document.getElementById(item.id);
        if (pointElement) pointElement.remove();
    });
    pointManuel5.length = 0
    pointManuel4.length = 0;
    // Gerekli değerlerin kontrolünü yapar ve eksikse uyarı verir
    var heceIsmi = document.getElementById('hece_ismi').value;
    var selectedRadioValue = getSelectedRadioValue('uygarlik');
    if (!heceIsmi || !selectedRadioValue) {
        alert("Hece ismi ve uygarlik seçilmeli");
        return;
    }
    if ((pointManuel4Sets.length <= 0 && pointManuel5Sets.length <= 0 && pointTemple4.length<=0 && pointTemple5.length<=0)) {
        alert("Yeni bir Üçgen veya Çizgi eklenemedi ")
    }
    else if (heceIsmi != "" && selectedRadioValue != "" && (pointManuel4Sets.length > 0 || pointManuel5Sets.length > 0 || pointTemple4.length>0 || pointTemple5.length>0 )) {
        const syllableList = new Set();
        // Nokta listelerini birleştirir ve tekrar edenleri kaldırır
        pointManuel4Sets.concat(pointManuel5Sets, pointTemple4, pointTemple5).forEach(set => {
            set.forEach(point => {
                if (!syllableList.has(JSON.stringify(point))) {
                    syllableList.add(JSON.stringify(point));
                    removeFromTrash(point, point === pointManuel5Sets ? pointManuel5Trash : pointManuel4Trash);
                }
            });
        });
        // Process lineList
        lineList.forEach(line => syllableList.add(JSON.stringify(line)));

        const heceName = { heceIsmi };
        const selectedValue = { selectedRadioValue };
        syllableList.add(JSON.stringify(heceName));
        syllableList.add(JSON.stringify(selectedValue));

        // SyllableList'teki değerleri pointSets'e ekler - point, heceName, selectedValue
        pointSets.push([...syllableList].map(item => JSON.parse(item)));
        pointManuel4Sets.length = 0;
        pointManuel5Sets.length = 0;
        pointTemple4.length=0;
        pointTemple5.length=0;
        const successAlert = document.getElementById("successAlert");
        successAlert.style.display = "block"; // Mesajı görüntüle
        setTimeout(function () {
            successAlert.style.display = "none"; // 2 saniye sonra gizle
        }, 2000); // 2 saniye = 2000 milisaniye
        lineList.length = 0;
        updateSyllableList(); // Hece listesini günceller
        // Gerekli alanları temizler ve radyo düğmesini işaretlenmemiş yapar
        document.getElementById('hece_ismi').value = ""
        var radioButtons = document.getElementsByName("uygarlik");
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].checked = false;
        }
    }
}

function updateSyllableList() {
    const syllableList = document.getElementById('syllableList');
    syllableList.innerHTML = ''; // Önce mevcut listeyi temizle

    // Her bir pointSet için hece ismini ve seçilen radyo değerini filtreler ve alır
    pointSets.forEach((pointSet, index) => {
        const filteredPointSet = pointSet.filter(point => point.hasOwnProperty('x') && point.hasOwnProperty('y'));
        const heceIsmi = pointSet.find(point => point.hasOwnProperty('heceismi'))?.heceismi || '';
        const selectedRadioValue = pointSet.find(point => point.hasOwnProperty('selectedRadioValue'))?.selectedRadioValue || '';

        // Eğer filtrelenmiş nokta seti boş değilse, yeni bir kart oluşturur ve listeye ekler
        if (filteredPointSet.length > 0) {
            const card = document.createElement('li');
            card.innerHTML = `
                <div class="card mr-3" style="width:175px; height:100px;">
                    <h6 style="font-size:12px;">Hece Seti ${index + 1}</h6>
                    <div style="font-size:12px;">Hece İsmi: ${heceIsmi}</div>
                    <div style="font-size:12px;">Dil: ${selectedRadioValue}</div>
                    <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCard(${index})">Delete</button> 
                </div>
            `;
            syllableList.appendChild(card);
        }
    });
}

function addWordCard() {
    const wordList = document.getElementById('wordList');
    const kelimeIsmi = document.getElementById('kelime_ismi').value;
    const wordLocation = getSelectedRadioValue("word_location");

    if (kelimeIsmi == "") {
        alert("kelime ismi bölümünü doldurunuz")
    }

    if (wordLocation == "") {
        alert("kelimenin konumunu seçiniz")
    }

    if (pointSets.length > 0 && kelimeIsmi != "" && wordLocation!="") {
        // PointSets'teki tüm hece listelerini tek bir liste öğesi olarak wordSets'e ekle
        wordSets.push({ kelime: kelimeIsmi, heceList: [...pointSets] });
        // PointSets'i temizle
        pointSets.length = 0;
        // Hece listesini temizle
        const syllableList = document.getElementById('syllableList');
        syllableList.innerHTML = '';
        // Kelime kartlarını oluştur ve listeye ekle
        wordList.innerHTML = ''; // Önce mevcut kelime kartlarını temizle
        wordSets.forEach((word, index) => {
            const card = document.createElement('li');
            card.classList.add('wordCard');
            // Kelimeye ait hece listesini oluşturur
            const heceListItems = word.heceList
                .map((hece, heceIndex) => `<li>Hece ${heceIndex + 1}: Hece İsmi: ${hece[hece.length - 2].heceismi}, Dil: ${hece[hece.length - 1].selectedRadioValue}</li>`)
                .join('');
            // Oluşturulan kartın içeriğini hazırlar ve listeye ekler
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6>Kelime: ${word.kelime}</h6>
                        <ul>${heceListItems}</ul>
                        <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCardKelime(${index})">Delete</button> 
                    </div>
                </div>
            `;
            wordList.appendChild(card);
        });
        // Kelime giriş alanını temizler
        document.getElementById('kelime_ismi').value = "";
    }
}
function saveBtnConfirm() {
    const heceIsmi = document.getElementById("hece_ismi").value;
    const uygarlik = getSelectedRadioValue("uygarlik");
    const kelimeIsmi = document.getElementById("kelime_ismi").value;
    const wordLocation = getSelectedRadioValue("word_location");
    const cumleIsmi = document.getElementById('cumle_ismi').value;

    saveBool = confirm("Yaptığınız Ekleme" + 
                        "\nHece İsmi: " + heceIsmi +
                        "\nUygarlık: " + uygarlik +
                        "\nKelime İsmi: " + kelimeIsmi +
                        "\nKelime Konumu: " + wordLocation +
                        "\nCümle İsmi: " + cumleIsmi);

    if(saveBool) {
        saveTransactions();
    }
}
function addSentenceCard() {
    const sentencesList = document.getElementById('sentencesList');
    const cumleIsmi = document.getElementById('cumle_ismi').value;
    if(cumleIsmi == "") {
        alert("cümle ismi bölümünü doldurumuz")
    }
        // Eğer wordSets dizisi doluysa ve cümle ismi boş değilse devam et

    if (wordSets.length > 0 && cumleIsmi != "") {
        // Yeni bir cümle seti oluşturup wordSets'teki kelime listesini kopyala
        sentenceSets.push({ cumleIsmi: cumleIsmi, kelimeList: [...wordSets] });
        wordSets.length = 0;
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';
        sentencesList.innerHTML = '';
        // Her bir cümle seti için bir kart oluştur ve listeye ekle
        sentenceSets.forEach((sentence, index) => {
            var card = document.createElement('li');
            card.classList.add('sentencesCard');
            // Kelime listesini kart içeriği olarak oluştur
            const wordListItems = sentence.kelimeList
                .map(kelime => `<li><em>${kelime.kelime}</em></li>`)
                .join('');
            card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6>Cumle: ${sentence.cumleIsmi}</h6>
                        <ul>${wordListItems}</ul>
                        <button class="btn-danger" style="width:50px; height:20px; font-size:10px" onclick="deleteCardCumle(${index})">Delete</button>
                    </div>
                </div>
            `;
            sentencesList.appendChild(card);
        });
        // Input alanını temizleme
        document.getElementById('cumle_ismi').value = "";
    }
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
    updateSyllableList();
}

function deleteCardKelime(index) {
    // Eğer verilen index wordSets dizisinin geçerli bir indeksi ise devam et
    if (index >= 0 && index < wordSets.length) {
        // Silinecek öğeleri belirtmek için silinecek öğelerin listesini al
        const deletedItems = wordSets[index].heceList;
        // Her bir öğe için döngü oluştur ve bunları listeden kaldır
        deletedItems.forEach(item => {
            item.forEach(deleteItem => {
                // Silinecek öğelerin her birini bul ve sil
                const element = deleteItem.hasOwnProperty('x') && deleteItem.hasOwnProperty('y')
                    ? document.getElementById(deleteItem.id)
                    : document.getElementById(deleteItem.id);
                if (element) {
                    element.remove();
                }
            });
        });
        // Verilen index'teki öğeyi wordSets dizisinden kaldır
        wordSets.splice(index, 1);
        // Silinen kartı görsel olarak da kaldır
        const card = document.getElementById('wordList').querySelectorAll('.wordCard')[index];
        if (card) {
            card.remove(); // Kartı sil
        }
        addWordCard(); // Kelime kartlarını güncelle
    }
}

function deleteCardCumle(index) {
    // Silinecek öğeleri toplamak için boş bir dizi oluştur
    const deletedItems = [];
    // Verilen indeksteki cümle kartının içindeki kelime listesinde dolaş ve hece listelerini deletedItems dizisine ekle
    sentenceSets[index].kelimeList.forEach(item => {
        item.heceList.forEach(subItem => {
            deletedItems.push(subItem);
        });
    });
    // Her bir silinecek öğe için döngü oluştur ve onları listeden kaldır
    deletedItems.forEach(item => {
        item.forEach(deleteItem => {
            const element = deleteItem.hasOwnProperty('x') && deleteItem.hasOwnProperty('y')
                ? document.getElementById(deleteItem.id)
                : document.getElementById(deleteItem.id);
            if (element) {   element.remove(); }
        });
    });

    sentenceSets.splice(index, 1);
    const sentencesList = document.getElementById('sentencesList');
    const card = sentencesList.querySelectorAll('.sentencesCard')[index];

    if (card) { card.remove(); }
    addSentenceCard();
}