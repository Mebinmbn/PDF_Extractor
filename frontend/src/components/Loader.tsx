import { GridLoader } from "react-spinners";
import image from "../assets/login_background.jpg";

function Loader() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover "
      style={{ backgroundImage: `url('${image}')` }}
    >
      <GridLoader color="#bc7833" loading={true} size={15} />
    </div>
  );
}

export default Loader;
