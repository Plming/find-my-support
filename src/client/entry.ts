function isFormValid(): boolean {
    const birthdate = document.querySelector<HTMLInputElement>("#birthdate");
    const income = document.querySelector<HTMLSelectElement>("#income");
    if (birthdate === null || income === null) {
        console.error("can't find birthdate or income node");
        return false;
    }

    if (birthdate.value === "" || income.value === "") {
        return false;
    }

    return true;
}

function onSubmit(): void {
    if (!isFormValid()) {
        return;
    }

    const spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");

    const submitButton = document.querySelector<HTMLInputElement>("#submit");
    if (submitButton === null) {
        console.error("can't find submit button");
        return;
    }

    submitButton.disabled = true;
    submitButton.appendChild(spinner);
}