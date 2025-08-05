<?php
/*===============================================================================
Autor: Juan Maturana - SoyMatudev
Fecha de Creación: 04/12/2024
ruta: thundersc/thundercloud/API_bot/BotService.php
===============================================================================*/

require_once(__DIR__ . '/../System/Connection/Connection.php');
require_once(__DIR__ . '/../ReturnEvent/ReturnEvent.php');
require_once(__DIR__ . '/../System/Connection/Statement.php');
require_once(__DIR__ . '/../ThunderLog/Log/thunderlog.log');
require_once(__DIR__ . '/../vendor/autoload.php');

class Bot
{
    private $token = null;
    private $TELEGRAM_API = null;
    private $chatId = null;
    private $text = null;
    private $thunderlog = null;

    function __construct($token, $chatId = null, $text = null)
    {
        $this->token = $token;
        $this->TELEGRAM_API = "https://api.telegram.org/bot".$this->token."/sendMessage";
        $this->chatId = $chatId;
        $this->text = $text;
        $this->thunderlog = new Log(null, "API_BOT");
    }

    function bot_response()
    {
        $data = [
            'chat_id' => $this->chatId,
            'text' => "🤖 Recibí tu mensaje desde Thundersc: \"{$this->text}\""
        ];

        $options = [
            'http' => [
                'header'  => "Content-Type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data),
            ],
        ];
        
        $this->thunderlog->writeLog("Enviando mensaje a Telegram: " . json_encode($data));
        $context  = stream_context_create($options);
        $response = file_get_contents($this->TELEGRAM_API, false, $context);
        
        // Responder al cliente
        header('Content-Type: application/json');
        //ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", json_decode($response, true));
        ReturnEvent::returnResponse(0, "Mensaje enviado correctamente", ["Todo bien" => "Simon"]);
    }
}
