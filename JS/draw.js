// const canvas = document.getElementById("draw");
// const ctx = canvas.getContext("2d");

// const btn = document.getElementById("save");
// const preview = document.getElementById("preview");

// btn.addEventListener("click", () => {
//   const imgData = canvas.toDataURL("image/png");

//   preview.src = imgData;
// });

// canvas.addEventListener("pointerdown", (e) => {
//   drawing = true;

//   const rect = canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;

//   ctx.beginPath();      // 👈 BẮT BUỘC
//   ctx.moveTo(x, y);     // 👈 bắt đầu từ điểm mới
// });

// canvas.addEventListener("pointermove", (e) => {
//   if (!drawing) return;

//   const rect = canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;

//   ctx.lineTo(x, y);
//   ctx.stroke();
// });

// canvas.addEventListener("pointerup", () => {
//   drawing = false;
// });

// <canvas id="draw" width="300" height="300"></canvas>

// <button id="save">Lưu</button>

// <img id="preview" />
