<?php require_once 'snippets/webpack.php' ?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <title></title>
  <?= liveCSS('assets/bundle.css') ?>
</head>
<body>
  <main>
    hello <?= isWebpack() ? 'from webpack' : '' ?>
  </main>
  <script src="assets/bundle.js"></script>
</body>
</html>
