import{useAddress, useMetamask} from '@thirdweb-dev/react';
const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  console.log("Address:", address);

  if(!address) {
    return (
      <div className="landing">
        <h1>Bem vindo à XGoHorseDAO - A única opção é a mais rápida!</h1>
        <button onClick={connectWithMetamask}>
          Conecte sua carteira
        </button>
      </div>
    );
  }

  return (
    <div className="landing">
      <h1>Bem-vindo DEVs. Resolveu o problema? Compilou? Commit e era isso.</h1>
    </div>
  )
}

export default App
