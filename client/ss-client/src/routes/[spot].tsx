import react from "react"
import {useParams} from "react-router-dom";
import Conditions from "../components/conditions";

export default function ConditionsRoute(){
    const {surfSpotId} = useParams()

    return (
        <main>
            <Conditions spotId={surfSpotId || "error"}></Conditions>
        </main>
    )

}