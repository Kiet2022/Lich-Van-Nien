const currentDate = new Date();
const dayOfWeekNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

function displayInfo() {
    let m = currentDate.getMonth();
    let y = currentDate.getFullYear();
    let firstDayOfMonth = new Date(y, m, 1);
    let firstDayOfMonthWeekIndex = firstDayOfMonth.getDay();
    let daysOfCurrentMonth = new Date(y, m + 1, 0).getDate();

    //Setup calendar header
    document.getElementById('currentMonth').innerText = `${currentDate.getMonth() + 1}`;
    document.getElementById('currentYear').innerText = `${currentDate.getFullYear()}`;
    document.getElementById('dayInMonthLabel').innerText = ` ${currentDate.getDate()} `;
    document.getElementById('selectedDayOfWeek').innerText = ` ${dayOfWeekNames[currentDate.getDay()]} `;

    //setup calendar footer
    let dayInput = document.getElementById('inputDayInMonth')
    let monthInput = document.getElementById('inputMonth')
    let yearInput = document.getElementById('inputYear')

    dayInput.value = currentDate.getDate();
    monthInput.value = currentDate.getMonth() + 1;
    yearInput.value = currentDate.getFullYear();

    document.getElementById('prev-year').addEventListener('click', function () {
        yearInput.value = Number(yearInput.value) - 1;
        handleGoTo();
    });
    document.getElementById('prev-month').addEventListener('click', function () {
        if (monthInput.value > 1) {
            monthInput.value = Number(monthInput.value) - 1;
            handleGoTo();
        } else {
            monthInput.value = 12;
            handleGoTo();
        }
    });

    document.getElementById('next-year').addEventListener('click', function () {
        yearInput.value = Number(yearInput.value) + 1;
        handleGoTo();
    });
    document.getElementById('next-month').addEventListener('click', function () {
        if (monthInput.value < 12) {
            monthInput.value = Number(monthInput.value) + 1;
            handleGoTo();
        }
        else {
            monthInput.value = 1;
            handleGoTo();
        }
    });

    document.getElementById('submitButton').addEventListener('click', function () {
        handleGoTo();
    });

    document.getElementById('resetButton').addEventListener('click', function () {
        reset();
    });

    //Setup calendar body
    let tableBody = addTableBodyData(firstDayOfMonthWeekIndex, daysOfCurrentMonth);
    document.getElementById('calendarTable').appendChild(tableBody);
    activeCurrentDate();
}
displayInfo();

function activeCurrentDate() {
    let date = document.getElementById('dayInMonthLabel').innerHTML;
    let month = document.getElementById('currentMonth').innerText;
    let year = document.getElementById('currentYear').innerText;
    let d = new Date(Number(year), Number(month - 1), Number(date)).getDay();
    document.getElementById('selectedDayOfWeek').innerText = ` ${dayOfWeekNames[d]} `;
    let cells = document.getElementsByTagName('td');

    for (let i = 0; i < cells.length; i++) {
        if (Number(cells[i].innerHTML) === Number(date)) {
            let cell = cells[i];
            cell.style.backgroundColor = 'greenyellow';
        }
    }
}


function deactiveCurrentSelectedCell(cellId) {
    let d = document.getElementById('dayInMonthLabel').innerText
    let cells = document.getElementsByTagName('td');

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === d) {
            let cell = cells[i];
            document.getElementById(cell.id).style.backgroundColor = 'rgb(233, 238, 196)'
        }
    }

}

function addTableBodyData(dayOfWeekStart, daysInMonth) {
    let body = document.createElement('tbody')
    body.id = 'tbody'

    let indexStart = dayOfWeekStart;
    let valueStart = 1;
    let indexEnd = indexStart + (6 - dayOfWeekStart);
    let rowIndex = 0;

    while (valueStart <= daysInMonth) {
        let row = addTableBodyRowData(indexStart, valueStart, indexEnd, rowIndex);
        body.appendChild(row);

        valueStart += (7 - indexStart);
        indexStart = 0;
        indexEnd = daysInMonth - valueStart >= 6 ? indexStart + 6 : daysInMonth - valueStart;
        rowIndex++;
    }
    return body;
}

function addTableBodyRowData(indexStart, valueStart, indexEnd, rowIndex) {
    let row = document.createElement('tr')
    row.id = `row_${rowIndex}`

    let currentDay = indexStart === 0 ? valueStart : 0;
    for (let i = 0; i < 7; i++) {

        let cell = createCell(rowIndex, i, currentDay);
        row.appendChild(cell);
        if (i + 1 === indexStart) {
            currentDay = valueStart;
        } else if (i + 1 < indexStart) {
            currentDay = 0;
        } else if (i + 1 > indexEnd) {
            currentDay = 0;
        } else {
            currentDay++;
        }
    }

    return row;
}

function createCell(rowIndex, collumnIndex, dayInMonth) {
    let cell = document.createElement('td');
    //cell_rowIndex_collumnIndex
    cell.id = `cell_${rowIndex}_${collumnIndex}`

    //Check if dayInMonth valid, then create name and field value
    if (dayInMonth > 0 && dayInMonth <= 31) {
        cell.name = `day_${dayInMonth}`
        cell.innerText = dayInMonth;
        cell.addEventListener('click', function () {
            if (cell.style.backgroundColor !== 'greenyellow') {
                deactiveCurrentSelectedCell();
                let d = document.getElementById('dayInMonthLabel');
                d.innerText = cell.innerText;
                cell.style.backgroundColor = 'greenyellow'
                document.getElementById('selectedDayOfWeek').innerText = ` ${dayOfWeekNames[collumnIndex]} `;
            }
        })
    }
    cell.style.color = 'black'
    if (collumnIndex === 0) {
        cell.style.color = 'red';
    } else if (collumnIndex === 6) {
        cell.style.color = 'blue';
    }

    return cell;
}


function handleGoTo() {
    let d = document.getElementById('inputDayInMonth').value;
    let m = document.getElementById('inputMonth').value;
    let y = document.getElementById('inputYear').value;

    document.getElementById('currentMonth').innerText = m;
    document.getElementById('currentYear').innerText = y;
    document.getElementById('dayInMonthLabel').innerText = d;


    let firstDayOfMonth = new Date(y, m - 1, 1);
    let firstDayOfMonthWeekIndex = firstDayOfMonth.getDay();
    let daysOfCurrentMonth = new Date(y, m, 0).getDate();


    if (d > daysOfCurrentMonth || d < 1) {
        document.getElementById('dayInMonthLabel').innerText = daysOfCurrentMonth;
        document.getElementById('inputDayInMonth').value = daysOfCurrentMonth;
    }
    if (m > 12 || m < 1) {
        document.getElementById('inputMonth').value = 12;
        document.getElementById('currentMonth').innerText = 12;
    }
    if (y < 1) {
        document.getElementById('inputYear').value = 0;
        document.getElementById('currentYear').innerText = 0;
    }

    let dayOfWeekName = new Date(y, m - 1, d).getDay();
    document.getElementById('selectedDayOfWeek').innerText = ` ${dayOfWeekName[d]} `;
    document.getElementById('tbody').remove();
    let tableBody = addTableBodyData(firstDayOfMonthWeekIndex, daysOfCurrentMonth);
    document.getElementById('calendarTable').appendChild(tableBody);

    activeCurrentDate();
}


function reset() {
    document.getElementById('tbody').remove();
    displayInfo();
}