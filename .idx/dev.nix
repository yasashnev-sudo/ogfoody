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
    
    # Table IDs (обновлено после пересоздания таблиц с английскими заголовками)
    NOCODB_TABLE_MEALS = "m6h073y33i44nwx";
    NOCODB_TABLE_EXTRAS = "m43rjzbwcon7a9p";
    NOCODB_TABLE_DELIVERY_ZONES = "mozhmlebwluzna4";
    NOCODB_TABLE_USERS = "mg9dm2m41bjv8ar";
    NOCODB_TABLE_ORDERS = "m96i4ai2yelbboh";
    NOCODB_TABLE_ORDER_PERSONS = "m6jccosyrdiz2bm";
    NOCODB_TABLE_ORDER_MEALS = "mvwp0iaqj2tne15";
    NOCODB_TABLE_ORDER_EXTRAS = "mm5yxpaojbtjs4v";
    NOCODB_TABLE_PROMO_CODES = "mbm55wmm3ok48n8";
    NOCODB_TABLE_REVIEWS = "mrfo7gyp91oq77b";
    NOCODB_TABLE_LOYALTY_POINTS_TRANSACTIONS = "mn244txmccpwmhx";
    NOCODB_TABLE_FRAUD_ALERTS = "mr9txejs65nk1yi";
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
