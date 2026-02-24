const URL = "model/";

let model, maxPredictions;

// โหลดโมเดล
async function loadModel() {
  document.getElementById("result").innerText = "กำลังโหลดโมเดล...";

  try {
    model = await tmImage.load(
      URL + "model.json",
      URL + "metadata.json"
    );

    maxPredictions = model.getTotalClasses();
    document.getElementById("result").innerText = "โหลดโมเดลสำเร็จ ✅";
    console.log("Model loaded. Classes:", maxPredictions);

  } catch (e) {
    console.error(e);
    document.getElementById("result").innerText = "โหลดโมเดลไม่สำเร็จ ❌";
  }
}

loadModel();

// เมื่ออัปโหลดรูป
document.getElementById("imageUpload").addEventListener("change", async (e) => {
  if (!model) {
    alert("กรุณาโหลดโมเดลก่อน");
    return;
  }

  const img = document.createElement("img");
  img.src = URL.createObjectURL(e.target.files[0]);
  img.width = 224;
  img.height = 224;

  img.onload = async () => {
    const prediction = await model.predict(img);

    // ✅ สำคัญมาก ดูค่าที่โมเดลทำนาย
    console.log("Prediction:", prediction);

    // เรียงจากความมั่นใจมาก → น้อย
    prediction.sort((a, b) => b.probability - a.probability);

    // แสดงผลลัพธ์หลัก
    let resultText = `ผลลัพธ์: ${prediction[0].className}
ความมั่นใจ: ${(prediction[0].probability * 100).toFixed(2)}%\n\n`;

    // แสดงผลทุกคลาส
    resultText += "รายละเอียดทั้งหมด:\n";
    prediction.forEach(p => {
      resultText += `- ${p.className}: ${(p.probability * 100).toFixed(2)}%\n`;
    });

    document.getElementById("result").innerText = resultText;
  };
});