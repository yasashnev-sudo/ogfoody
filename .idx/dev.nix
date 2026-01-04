{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.pnpm
  ];
  env = {
    # NocoDB Configuration
    NOCODB_URL = "https://noco.povarnakolesah.ru";
    NOCODB_TOKEN = "eppmI3qJq8ahGaCzPmjmZGIze9NgJxEFQzu6Ps1r";
    NOCODB_BASE_ID = "p9id5v4q0ukk9iz";
    NOCODB_PROJECT_ID = "p9id5v4q0ukk9iz";
    
    # Table IDs
    NOCODB_TABLE_MEALS = "mmtctn4flssh2ua";
    NOCODB_TABLE_EXTRAS = "mksy21hmttmo855";
    NOCODB_TABLE_DELIVERY_ZONES = "mpoppulqhsz1der";
    NOCODB_TABLE_USERS = "mvrp4r9o3z69c45";
    NOCODB_TABLE_ORDERS = "meddiicl0gr0r8y";
    NOCODB_TABLE_ORDER_PERSONS = "mvr08d33zm5i8oi";
    NOCODB_TABLE_ORDER_MEALS = "ma2swd51ph89csr";
    NOCODB_TABLE_ORDER_EXTRAS = "mebruxwjsnxrxj9";
    NOCODB_TABLE_PROMO_CODES = "mgov8ce836696fy";
    NOCODB_TABLE_REVIEWS = "mv8c69ib9muz9ki";
  };
  idx = {
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };
    workspace = {
      onCreate = {
        install = "pnpm install";
      };
      onStart = {
        # Автоматически запускать сервер при старте среды
        run-server = "npm run dev -- --port 3000 --hostname 0.0.0.0";
      };
    };
  };
}
