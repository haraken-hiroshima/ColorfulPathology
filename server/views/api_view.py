from flask import Blueprint, Response, jsonify, request
import cv2
import io
import numpy as np
import base64

api_bp = Blueprint("api", __name__, url_prefix="/api")

### 画像編集 ################################################################
def imgTransform(img):
    f = img.stream.read()
    bin_data = io.BytesIO(f)
    file_bytes = np.asarray(bytearray(bin_data.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img_r = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    hsv = cv2.cvtColor(img_r, cv2.COLOR_BGR2HSV)
    return hsv

def hsvTransform(img,hsvLower,hsvUpper):
    f = img.stream.read()
    bin_data = io.BytesIO(f)
    file_bytes = np.asarray(bytearray(bin_data.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img_r = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    hsv = cv2.cvtColor(img_r, cv2.COLOR_BGR2HSV)
    hsvLower = np.array(hsvLower)
    hsvUpper = np.array(hsvUpper)
    img_mask_hsv = cv2.inRange(hsv, hsvLower, hsvUpper) # HSVからマスクを作成
    # マスク画像合成
    img_result_hsv = cv2.bitwise_and(img, img, mask=img_mask_hsv)
    return img_result_hsv

### ルーティング ##############################################################

@api_bp.route("/test", methods=["GET"])
def index() -> Response:
    """Defines the main website view"""
    return jsonify("Working")

@api_bp.route("/toHSV", methods=["POST"])
def toHSV() -> Response:
    if request.method == 'POST':
        img = request.files["image"]
        res = imgTransform(img)
        retval, buffer = cv2.imencode('.png', res)
        jpg_as_text = base64.b64encode(buffer)
        return Response(response=jpg_as_text, content_type='image/jpeg')
    else:
        return "This is toHSV !"

@api_bp.route("/toMask", methods=["POST"])
def toMask() -> Response:
    if request.method == 'POST':
        img = request.files["img"]
        hsvLower = eval(request.form["hsvLower"])
        hsvUpper = eval(request.form["hsvUpper"])
        res = hsvTransform(img,hsvLower,hsvUpper)
        retval, buffer = cv2.imencode('.png', res)
        jpg_as_text = base64.b64encode(buffer)
        return Response(response=jpg_as_text, content_type='image/jpeg')
    else:
        return "This is toMask !"
