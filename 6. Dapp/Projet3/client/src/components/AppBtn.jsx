
function AppBtn ({type}) {

    const getText = () => {
        let text = "";
        switch(type) {
            case "voters":
                text="Liste des votants";
                break;
            case "proposals": 
                text="Liste des propositions";
                break;
            case "voting": 
                text="Voter";
                break;
            case "result":
                text="Voir la proposition gagnante";
                break;
            default: break;
        }
        return text;
    }

    return(
        <div className="appBtn" onClick={() => {console.log('clicked')}}>
            <span>IMG</span>
            <span>{getText()}</span>

        </div>
    );
}

export default AppBtn;