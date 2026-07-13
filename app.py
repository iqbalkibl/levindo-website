from flask import Flask, render_template, send_file
from flask_sqlalchemy import SQLAlchemy
import io
import os
import json
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from deep_translator import GoogleTranslator
from content import BASE_CONTENT


app = Flask(__name__) 

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///projects.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ======================
# TRANSLATION SYSTEM
# ======================
def get_translated_data(lang):

    cache_file = "translations_cache.json"

    if os.path.exists(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            cache = json.load(f)
    else:
        cache = {}

    # Kalau sudah ada di cache
    if lang in cache:
        return cache[lang]

    # Bahasa default
    if lang == "id":
        return BASE_CONTENT

    translator = GoogleTranslator(source="id", target=lang)

    def translate_value(value):

        # Kalau string
        if isinstance(value, str):
            return translator.translate(value)

        # Kalau list atau tuple
        elif isinstance(value, (list, tuple)):
            return [translate_value(item) for item in value]

        # Kalau dictionary (nested)
        elif isinstance(value, dict):
            return {
                k: translate_value(v)
                for k, v in value.items()
            }

        # Selain itu biarkan
        else:
            return value

    translated = translate_value(BASE_CONTENT)

    cache[lang] = translated

    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    return translated



# ======================
# ROUTES
# ======================

@app.route("/")
def root():
    return home("id")

@app.route("/<lang>/")
def home(lang):
    if lang not in ["id", "en"]:
        lang = "id"

    data = get_translated_data(lang)

    return render_template(
        "home.html",
        title="Home",
        lang=lang,
        heading=data["ui"]["company_name"],
        subheading=data["ui"]["subheading"],
        tagline_desc=data["ui"]["tagline_desc"],
        nav=data["ui"],
        content=data['home']
)


@app.route("/<lang>/services")
def services(lang):
    if lang not in ["id", "en"]:
        lang = "id"

    data = get_translated_data(lang)

    items = ''.join([f"<li>{s}</li>" for s in data['services']])

    return render_template(
        "services.html",
        title=data["ui"]["nav_services"],
        lang=lang,
        heading=data["ui"]["company_name"],
        subheading=data["ui"]["services_title"],
        tagline_desc=data["ui"]["tagline_desc"],
        nav=data["ui"],
        card1=data["ui"]["service1"],
        card2=data["ui"]["service2"],
        card3=data["ui"]["service3"],
        card4=data["ui"]["service4"],
        desc1=data["ui"]["description1"],
        desc2=data["ui"]["description2"],
        desc3=data["ui"]["description3"],
        desc4=data["ui"]["description4"],
        content=data['services']

)


@app.route("/<lang>/projects")
def projects(lang):
    if lang not in ["id", "en"]:
        lang = "id"
    
    data = get_translated_data(lang)
    projects = Project.query.all()
    projects_data = [p.to_dict() for p in projects]

    map_html = '<div id="projectMap" style="width:100%; height:420px;"></div>'

    return render_template(
    "projects.html",
        projects=projects_data,
        title=data["ui"]["nav_projects"],
        lang=lang,
        heading=data["ui"]["company_name"],
        subheading=data["ui"]["subheading"],
        tagline_desc=data["ui"]["tagline_desc"],
        nav=data["ui"],
        card1=data["ui"]["project1"],
        card2=data["ui"]["project2"],
        card3=data["ui"]["project3"],
        card4=data["ui"]["project4"],
        cardbtn=data["ui"]["buttonview"],
        content1=data['projects'],
        content2=map_html 
)



@app.route("/<lang>/contact")
def contact(lang):
    if lang not in ["id", "en"]:
        lang = "id"

    data = get_translated_data(lang)

    return render_template(
        "home.html",
        title=data["ui"]["nav_contact"],
        lang=lang,
        heading=data["ui"]["company_name"],
        subheading=data["ui"]["subheading"],
        tagline_desc=data["ui"]["tagline_desc"],
        nav=data["ui"],
        content=f"<p>{data['contact']}</p>"
)

@app.route("/<lang>/about")
def about(lang):
    if lang not in ["id", "en"]:
        lang = "id"

    data = get_translated_data(lang)

    return render_template(
        "about.html",
        title=data["ui"]["nav_about"],
        lang=lang,
        heading=data["ui"]["company_name"],
        subheading=data["ui"]["aboutlcb"],
        tagline_desc=data['about'],
        nav=data["ui"],
        content1=data["ui"]["alatkami"],
        content2=data['peralatan'],
        content3=data['alat'],
        content=BASE_CONTENT
        

 )


if __name__ == "__main__":
    app.run(debug=True)
    


