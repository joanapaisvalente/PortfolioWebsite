import Header from "./components/header/Header";
import Menu from "./components/menu/Menu";
import Sidebar from "./components/sidebar/Sidebar";
import "./app.css";
import {IntlProvider, FormattedMessage} from "react-intl";
import messages from './translations'
import { useSelector } from "react-redux";
import Home from "./pages/home/Home.jsx"

function App() {
  
  const locale = useSelector(state => state.updateGeneralInformation.urlInfo.lang);

  return (
    <IntlProvider locale={locale} messages ={messages[locale]}>
    <div className="App">
      <Header />
      <Menu />
      <Sidebar />
        <div className="homeInfo">
          <h3 className="title"><FormattedMessage id={"stats"}/></h3>
          <Home />
        </div>
      </div>
      </IntlProvider>  
  );
}

export default App;
