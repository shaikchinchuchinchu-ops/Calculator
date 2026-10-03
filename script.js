// =====================================
// CALCULATOR
// =====================================

const display = document.getElementById("display");


// =====================================
// ADD VALUE TO DISPLAY
// =====================================

function addToDisplay(value) {

    // If display has an error
    if (display.value === "Error") {
        display.value = "0";
    }


    // Prevent multiple decimal points
    if (value === ".") {

        const parts =
            display.value.split(/[\+\-\*\/%]/);

        const currentNumber =
            parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }
    }


    // Replace initial zero
    if (
        display.value === "0" &&
        value !== "."
    ) {

        display.value = value;

    } else {

        display.value += value;

    }
}


// =====================================
// CLEAR DISPLAY
// =====================================

function clearDisplay() {

    display.value = "0";
}


// =====================================
// DELETE LAST CHARACTER
// =====================================

function deleteLast() {

    if (display.value === "Error") {

        display.value = "0";

        return;
    }


    display.value =
        display.value.slice(0, -1);


    if (display.value === "") {

        display.value = "0";

    }
}


// =====================================
// CALCULATE
// =====================================

function calculate() {

    try {

        let expression =
            display.value;


        // Don't calculate empty expression
        if (
            expression === "" ||
            expression === "0"
        ) {
            return;
        }


        // Convert percentage
        expression =
            expression.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );


        // Calculate
        const result =
            eval(expression);


        // Check valid result
        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {

            display.value = "Error";

            return;
        }


        // Avoid very long decimal results
        const formattedResult =
            Number(
                result.toPrecision(12)
            );


        // Save original expression
        addToHistory(
            display.value,
            formattedResult
        );


        // Show result
        display.value =
            formattedResult;

    }

    catch {

        display.value = "Error";

    }
}


// =====================================
// HISTORY
// =====================================

function addToHistory(
    expression,
    result
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "calculatorHistory"
            )
        ) || [];


    // Add newest calculation first
    history.unshift({

        expression: expression,

        result: result

    });


    // Keep latest 20 calculations
    history =
        history.slice(0, 20);


    // Save
    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );


    // Update UI
    displayHistory();
}


// =====================================
// DISPLAY HISTORY
// =====================================

function displayHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    let history =
        JSON.parse(
            localStorage.getItem(
                "calculatorHistory"
            )
        ) || [];


    // Empty history
    if (history.length === 0) {

        historyList.innerHTML = `
            <p class="empty-history">
                No calculations yet
            </p>
        `;

        return;
    }


    // Clear current list
    historyList.innerHTML = "";


    // Create history items
    history.forEach(function(item) {

        const historyItem =
            document.createElement("div");


        historyItem.className =
            "history-item";


        const expression =
            document.createElement("span");

        expression.className =
            "history-expression";

        expression.textContent =
            item.expression;


        const result =
            document.createElement("span");

        result.className =
            "history-result";

        result.textContent =
            item.result;


        historyItem.appendChild(
            expression
        );

        historyItem.appendChild(
            result
        );


        historyList.appendChild(
            historyItem
        );

    });
}


// =====================================
// CLEAR HISTORY
// =====================================

function clearHistory() {

    localStorage.removeItem(
        "calculatorHistory"
    );


    displayHistory();
}


// =====================================
// KEYBOARD SUPPORT
// =====================================

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key;


        // Numbers
        if (
            key >= "0" &&
            key <= "9"
        ) {

            addToDisplay(key);

            return;
        }


        // Decimal
        if (key === ".") {

            addToDisplay(".");

            return;
        }


        // Addition
        if (key === "+") {

            addToDisplay("+");

            return;
        }


        // Subtraction
        if (key === "-") {

            addToDisplay("-");

            return;
        }


        // Multiplication
        if (key === "*") {

            addToDisplay("*");

            return;
        }


        // Division
        if (key === "/") {

            event.preventDefault();

            addToDisplay("/");

            return;
        }


        // Percentage
        if (key === "%") {

            addToDisplay("%");

            return;
        }


        // Enter
        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

            return;
        }


        // Backspace
        if (key === "Backspace") {

            event.preventDefault();

            deleteLast();

            return;
        }


        // Escape
        if (key === "Escape") {

            clearDisplay();

            return;
        }

    }
);


// =====================================
// LOAD HISTORY WHEN PAGE OPENS
// =====================================

displayHistory();