import NavBar from "./../components/navbar"
import SidebarComponent from "../components/sidebar";
import coinsImg from "./../img/coinspage.png"
import "./styles/coins_screen.css"

function CoinsScreen() {


	return (
		<div id="coins-screen">
			<NavBar path={""} />
			<SidebarComponent props={"coins_screen"} />

			<main>
				<img src={coinsImg} alt="Apercu de ce qui est censé y avoir sur cette page" />
			</main>

		</div>

	);
}

export default CoinsScreen;