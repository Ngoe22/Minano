// take a shoot
// const btn = document.getElementById("captureBtn");


// call keyboard
document.body.onclick = (e) => {
    const CL = e.target.classList;
    if (CL.contains(`call-the-keyboard`)) {
        importKeyboard.keyboardToggle(e.target.previousElementSibling);
    }
};
