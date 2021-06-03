import { useHistory } from "react-router";
import Button from "../../components/buttons/button";
import VerticalCenter from "../../components/vertical-center";

export default function NewStore(props) {
    const history = useHistory();
    return (
        <VerticalCenter>
            <div className="create-store-dash-boarder">
                <Button onClick={() => {
                    history.push(`/setup-store/detail`);
                }}>Create Your Store</Button>
            </div>
        </VerticalCenter>
    )
}