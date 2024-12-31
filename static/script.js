let form = document.forms["inp-form"]
let cont = document.querySelector(".img-cont")
let pred_cont = document.querySelector(".pred-cont")
let file_select = document.querySelector(".file_select")
let actual_but = document.querySelector(".actual_but")


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = new FormData(form); // construct payload

    if (!file_select.files.length) {
        alert("No file selected")
    }

    const response = await fetch(
        "/predict", 
        { method: "POST", body }
    ).then((response) => {
        console.log(response)
        return response.json()
    }).then((data) => {
        // document.querySelector("img").src = URL.createObjectURL(data)
        // document.querySelector("img").src = "data:image/*;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(data)))
        // const blob = new Blob([data])
        // document.querySelector("img").src = URL.createObjectURL(blob)
        // var bitmap;
        // createImageBitmap(blob).then((btm) => {
            // bitmap = btm
            // console.log(typeof bitmap)
        // })
        // console.log(typeof bitmap)
        // ctx.drawImage(bitmap, 0, 0)
        // const n = Number(data["file_num"])
        // const img = document.createElement("img")
        // if (n == 0) {
            // img.src = "static/saliency.png"
        // }    
        // else {
            // img.src = "static/saliency" + n + ".png"
        // }

        // img.height = 350
        // img.onload = () => {
        //   URL.revokeObjectURL(img.src);
        // }
        // cont.innerHTML = ""
        // cont.appendChild(img)
        // console.log(data)

        const num = Number(data["pred"])
        const values = {0: "Prediction -> Level 0: ", 1: "Prediction -> Level 1: ", 2: "Prediction -> Level 2: ", 3: "Prediction -> Level 3: ", 4: "Prediction -> Level 4: "}
        const values2 = {0: "Normal", 1: "Early", 2: "Mild", 3: "Moderate", 4: "Severe"}
        const colors = {0: "#058905", 1: "#9ca937", 2: "orange", 3: "#ff4900", 4: "red"}

        let p = document.createElement("p")
        let span = document.createElement("span")

        pred_cont.innerHTML = ""

        p.innerHTML = values[num]
        span.innerHTML = values2[num]
        p.style.color = "black"
        span.style.color = colors[num]
        p.appendChild(span)
        pred_cont.appendChild(p) 

    });

});

function getData() {
    fetch("/predict", {
        method: "POST",
        body: inp.files[0],
        headers:{}
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request failed');
            }
        })
        .then((data) => {
            console.log(data);
        })  
}

function handleFiles() {
    if (!inp.files.length) {
        alert("No file selected")
    } else {
        img_file = inp.files[0]
        const img = document.createElement("img")
        img.src = URL.createObjectURL(img_file)
        img.height = 60
        img.onload = () => {
          URL.revokeObjectURL(img.src);
        }
        document.body.appendChild(img)
    }
}

function clickFile() {
    file_select.click()
}

function handleChange() {
    f = file_select.value
    f = f.split("\\")
    f = f[f.length - 1]
    actual_but.innerHTML = f

    if (!file_select.files.length) {
        alert("No files selected")
    } else {
        cont.innerHTML = ""
        img_file = file_select.files[0]
        const img = document.createElement("img")
        img.src = URL.createObjectURL(img_file)
        img.height = 200
        img.onload = () => {
          URL.revokeObjectURL(img.src);
        }
        cont.appendChild(img)
    }
}

actual_but.addEventListener("click", clickFile)
file_select.addEventListener("change", handleChange, false)