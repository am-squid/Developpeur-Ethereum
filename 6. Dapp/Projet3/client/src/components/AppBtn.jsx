
function AppBtn ({type, show, currentState}) {

    const getText = () => {
        let text = "";
        switch(type) {
            case "voters":
                text="Liste des votants";
                return text;
            case "proposals": 
                if(currentState < 1) {
                    text="Les propositions ne sont pas disponibles";
                    return text;
                }
                text="Liste des propositions";
                return text;
            case "voting": 
                if(currentState != 3) {
                    text="Les votes ne sont pas ouverts";
                    return text;
                }
                text="Voter";
                return text;
            case "result":
                if(currentState != 5) {
                    return "Les résultats ne sont pas encore disponibles";
                }
                text="Voir la proposition gagnante";
                return text;
            default: break;
        }
    }

    let className = "appBtn";
    if(currentState < 1 && type === "proposals") {
        className += " disabled";
    }

    if(currentState != 3 && type === "voting") {
        className += " disabled";
    }

    if(currentState != 5 && type === "result") {
        className += " disabled";
    }

    return(
        <div className={className} onClick={show}>
            <div className="btnImg">IMG</div>
            <div className="btnText">{getText()}</div>
        </div>
    );
}

export default AppBtn;