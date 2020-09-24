using {SCIManagementService as Service} from '../srv/SCIManagement';
using {SCIManagementService.SCI_MST_CODE_SRV as MST_CODE} from '../srv/SCIManagement';
using {SCIManagementService.SCI_MST_SYSTEMLIST_SRV as MST_SYSTEMLIST} from '../srv/SCIManagement';
using {SCIManagementService.SCI_TP_INTERFACELIST_SRV as TP_INTERFACELIST} from '../srv/SCIManagement';


annotate Service with @title : 'SCI Management Service';
annotate TP_INTERFACELIST with @title : 'InterfaceList Table' {};
