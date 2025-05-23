function Entrar(){

    var textoEmail = document.getElementById('txtemail').value;

    var textoSenha = document.getElementById('txtsenha').value;

    if(textoEmail == "adm@gmail.com" && textoSenha == "ADM12345")
        {
            window.location.href = 'landingpage.html';
        }else{
            alert("Email ou senha inválidos.")
        }
    
        
    }