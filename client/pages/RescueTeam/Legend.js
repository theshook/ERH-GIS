export default function () {
  var icons = {
    drrm: {
      name: 'DRRM',
      icon: '/drrm.png',
    },
    parking: {
      name: 'First Aid',
      icon: '/firstaid.png',
    },
    library: {
      name: 'Fire Men',
      icon: '/firemen.png',
    },
    info: {
      name: 'Police',
      icon: '/police.png',
    },
    solved: {
      name: 'Responded Incident',
      icon: '/grn-circle.png',
    },
    unsolved: {
      name: 'Unresponded Incident',
      icon: '/red-circle.png',
    },
  };
  var legend = document.getElementById('legend');
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }
}
