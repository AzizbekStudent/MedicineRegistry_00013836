// validation of the form 
function FormValidation_M() {
    const name = document.getElementById("name_m").value.trim();
    const description = document.getElementById("description_m").value.trim();

    if (name === "" || description === "") {
        alert("Please enter a value for Name and Description");
        return false;
    }

    return true;
}
// I use this function only for validation of creating new medicine or updating the existing medicine records
// otherwise application shows error

function FormValidation_C() {
    const name = document.getElementById("name_c").value.trim();
    const description = document.getElementById("decs_c").value.trim();

    if (name === "" || description === "") {
        alert("Please enter a value for Name and Description");
        return false;
    }

    return true;
}