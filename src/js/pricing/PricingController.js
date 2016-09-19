export default function() {
  'ngInject';

  const vm = this;

  const serviceFeatures = new Set();

  vm.fullBoardCost = 100;
  vm.dbBoardCost = 30;
  vm.initialCost = 300;
  vm.serviceFeatureCost = 500;
  vm.dbCost = 500;

  vm.fullBoardCount = 10;
  vm.dbBoardCount = 0;
  vm.dbSelected = false;

  vm.configureDatabase = configureDatabase;
  vm.unconfigureDatabase = unconfigureDatabase;
  vm.hasServiceFeature = hasServiceFeature;
  vm.selectServiceFeature = selectServiceFeature;
  vm.removeServiceFeature = removeServiceFeature;
  vm.payingDbBoardCount = payingDbBoardCount;
  vm.totalDbBoardsCount = totalDbBoardsCount;
  vm.subtotal = subtotal;
  vm.discount = discount;
  vm.total = total;

  function configureDatabase() {
    vm.configDatabase = true;
    vm.dbSelected = true;
    vm.dbBoardCount = vm.fullBoardCount || 10;
  }

  function unconfigureDatabase() {
    vm.configDatabase = false;
    vm.dbSelected = false;
    vm.dbBoardCount = 0;
  }

  function hasServiceFeature(feature) {
    return serviceFeatures.has(feature);
  }

  function selectServiceFeature(feature) {
    serviceFeatures.add(feature);
  }

  function removeServiceFeature(feature) {
    serviceFeatures.delete(feature);
  }

  function subtotal() {
    return vm.initialCost +
           (vm.dbSelected ? vm.dbCost : 0) +
           serviceFeatures.size * vm.serviceFeatureCost +
           groupCost();
  }

  function discount() {
    return subtotal() - total();
  }

  function totalDbBoardsCount() {
    return Math.max(vm.fullBoardCount, vm.dbBoardCount);
  }

  function payingDbBoardCount() {
    return (Math.max(0, vm.dbBoardCount - vm.fullBoardCount));
  }

  function groupCost() {
    return vm.fullBoardCount * vm.fullBoardCost +
          vm.dbBoardCost * payingDbBoardCount();
  }

  function total() {
    return Math.max(groupCost(), Math.min(5000, subtotal()));
  }
}
