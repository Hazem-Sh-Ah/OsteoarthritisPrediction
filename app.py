from flask import Flask, render_template, request, send_file
import os
from tensorflow.keras.saving import load_model
from PIL import Image 
import io
import numpy as np
import cv2
# import torch
# from captum.attr import Saliency
# from scipy import ndimage
# import matplotlib.pyplot as plt
# import matplotlib

# matplotlib.use('Agg')

model = load_model("models/model.keras")
# model2 = torch.load("model.pth", weights_only=False)
# saliency = Saliency(model2)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

# def generate_saliency(im):
#     im = im.reshape(1, 200, 200).astype("float32")
#     im2 = torch.tensor(im)
#     saliency_map = saliency.attribute(im2, target=2)
#     saliency_map = saliency_map.squeeze().detach().cpu().numpy()  # Shape: (H, W) or (C, H, W)
#     if saliency_map.ndim == 3:  # Multi-channel input
#         saliency_map = np.max(np.abs(saliency_map), axis=0)
    
#     saliency_map = (saliency_map - saliency_map.min()) / (saliency_map.max() - saliency_map.min())
#     heatmap = cv2.applyColorMap(np.uint8(255 * saliency_map), cv2.COLORMAP_JET)

#     overlay = cv2.addWeighted(im.astype(np.uint8), 0.6, cv2.cvtColor(heatmap, cv2.COLOR_RGB2GRAY).reshape(1,200, 200), 0.4, 0)

#     rotated = ndimage.rotate(overlay.T, 90)
#     return rotated

def predict_image(request):
    img = np.array(Image.open(io.BytesIO(request.files["file"].read())))
    if len(img.shape) > 2:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)    
    img = cv2.resize(img, (200, 200))
    img_2 = img.reshape(1, 200, 200)

    model_pred = int(np.argmax(model(img_2)))
    # new_img =  generate_saliency(img)

    # new_img = Image.fromarray(cv2.cvtColor(new_img, cv2.COLOR_GRAY2RGB))
    # new_img.save("")
    # new_img = base64.b64encode(new_img.tobytes()).decode("utf-8")
    # plt.imshow(new_img, cmap="bone")  # Use a heatmap color scheme

    # plt.axis('off')
    # p = ""
    # correct_p = ""
    # num = 0
    # for path in os.listdir("static"):
    #     if path[:3] == "sal":
    #         p = path
    # if p:
    #     os.remove("static/" + p)
    #     path_n = p.split(".")[0].split("y")[1]
    #     if path_n:
    #         correct_p = f"saliency{int(path_n)+1}.png"
    #         num = int(path_n) + 1
    #     else:
    #         correct_p = "saliency2.png"
    #         num = 2
    # else:
    #     correct_p = "saliency.png"

    # plt.savefig("static/"+correct_p, bbox_inches='tight')

    # plt.clf()
    return model_pred #, num
    
@app.route("/predict", methods=["POST"])
def predict():
    # prediction, num = predict_image(request)
    prediction = predict_image(request)
    # return send_file(io.BytesIO(prediction.tobytes()), mimetype="image/png")
    # return {"file_num": num, "pred": prediction}
    return {"pred": prediction}


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)