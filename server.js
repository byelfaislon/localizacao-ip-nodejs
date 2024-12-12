// Importa as dependências
const express = require('express');
const axios = require('axios');

// Cria uma instância do Express
const app = express();
const port = process.env.PORT || 3000; // Usa a porta do Railway ou 3000

// Configura o Express para interpretar JSON
app.use(express.json());

// Função que consulta a localização por IP
async function getLocationByIP(ip) {
  const apiKey = 'f03915bf01f563'; // Substituído pelo seu token da API
  const url = `https://ipinfo.io/${ip}/json?token=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data; // Retorna dados como cidade, região e país
  } catch (error) {
    console.error('Erro ao consultar localização:', error);
    return null;
  }
}

// Rota do Webhook
app.post('/webhook', async (req, res) => {
  const ip = req.body.ip; // Recebe o IP do ManyChat
  const location = await getLocationByIP(ip);

  if (location) {
    // Retorna a localização como resposta
    res.json({
      location: location.city || 'Cidade desconhecida',
      region: location.region || 'Região desconhecida',
      country: location.country || 'País desconhecido',
    });
  } else {
    res.status(500).json({ error: 'Não foi possível obter a localização' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
