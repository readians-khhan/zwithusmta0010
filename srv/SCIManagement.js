const cds = require("@sap/cds");
const SequenceHelper = require("./lib/SequenceHelper");
const nodemailer = require("nodemailer");
const Email = require('email-templates');
const objectPath = require('object-path');
const _ = require('lodash');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bf = require("./lib/BaseFunction");

module.exports = cds.service.impl(async (srv) => {

  srv.before("CREATE", "SCI_MST_SYSTEMLIST_SRV", async (req) => {
    if ((req.params.length > 0)) {
      req.error({
        message: `The ID does not exist in the database. : ${req.data.ID}`,
        target: 'SCI_MST_SYSTEMLIST_SRV'
      });
      return;
    }

    // ▶ Data Check Logic
    // * Not Null
    // -> COMPANY_CD
    if(bf.IsNotValid(req.data.APPPLTYPE_CD_ID)){
      req.error({
        message: `APPPLTYPE_CD_ID value is mandatory. APPPLTYPE_CD_ID : ${req.data.APPPLTYPE_CD_ID}`,
        target: 'SCI_MST_SYSTEMLIST_SRV'
      });
    }

    // -> COMPANY_CD_ID	
    if(bf.IsNotValid(req.data.COMPANY_CD_ID)){
      req.error({
        message: `COMPANY_CD_ID value is mandatory. COMPANY_CD_ID : ${req.data.SUBSIDARY_CD_ID}`,
        target: 'SCI_MST_SYSTEMLIST_SRV'
      });
    }

    // -> APPL_NM	
    if(bf.IsNotValid(req.data.APPL_NM)){
      req.error({
        message: `APPL_NM value is mandatory. APPL_NM : ${req.data.APPL_NM}`,
        target: 'SCI_MST_SYSTEMLIST_SRV'
      });
    }

    // -> SYSTEM_NM
    if(bf.IsNotValid(req.data.SYSTEM_NM)){
      req.error({
        message: `SYSTEM_NM value is mandatory. SYSTEM_NM : ${req.data.SYSTEM_NM}`,
        target: 'SCI_MST_SYSTEMLIST_SRV'
      });
    }

    // * Data UNIQUE
    let aSelect = await SELECT.from('SCI_MST0020').where({
      APPPLTYPE_CD_ID: req.data.APPPLTYPE_CD_ID,
      COMPANY_CD_ID: req.data.COMPANY_CD_ID,
      SUBSIDARY_CD_ID: req.data.SUBSIDARY_CD_ID,
      APPL_NM: req.data.APPL_NM,
      SYSTEM_NM: req.data.SYSTEM_NM
    });

    if (aSelect.length > 0) {
      req.reject({
        message: JSON.stringify({
          description: "Aleready Exist Data",
          APPPLTYPE_CD_ID: req.data.APPPLTYPE_CD_ID,
          COMPANY_CD_ID: req.data.COMPANY_CD_ID,
          SUBSIDARY_CD_ID: req.data.SUBSIDARY_CD_ID,
          APPL_NM: req.data.APPL_NM,
          SYSTEM_NM: req.data.SYSTEM_NM
        }),
        target: 'SCI_MST_SYSTEMLIST_SRV'
      });
    }
  });

  srv.after("CREATE", "SCI_MST_SYSTEMLIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogSystemList", _.cloneDeep(data));
  }));

  srv.after("UPDATE", "SCI_MST_SYSTEMLIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogSystemList", _.cloneDeep(data));
  }));

  srv.before("CREATE", "SCI_MST_CODE_SRV", async (req) => {
    if ((req.params.length > 0)) {
      req.reject({
        message: `The ID does not exist in the database. : ${req.data.ID}`,
        target: 'SCI_MST_CODE_SRV'
      });
    }
  });

  srv.after("CREATE", "SCI_MST_CODE_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogCodeList", _.cloneDeep(data));
  }));

  srv.after("UPDATE", "SCI_MST_CODE_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogCodeList", _.cloneDeep(data));
  }));

  srv.before("CREATE", "SCI_TP_INTERFACELIST_SRV", async (req) => {
    if ((req.params.length > 0)) {
      req.reject({
        message: `The ID does not exist in the database. : ${req.data.ID}`,
        target: 'SCI_TP_INTERFACELIST_SRV'
      });
    }

    const cInterfaceID = new SequenceHelper({
      db: cds.db,
      sequence: "INTERFACE_ID",
      table: "SCI_TP0010",
      field: "IF_NO"
    });
    req.data.IF_NO = await cInterfaceID.getNextNumber();
  });

  srv.after("CREATE", "SCI_TP_INTERFACELIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogInterfaceList", _.cloneDeep(data));
    if (objectPath.get(data,'BATCH',false)) {
      tx.emit("LogBatchList", _.cloneDeep(data.BATCH));
    }

  }));

  srv.after("UPDATE", "SCI_TP_INTERFACELIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogInterfaceList", _.cloneDeep(data));
    if (objectPath.get(data,'BATCH',false)) {
      tx.emit("LogBatchList", _.cloneDeep(data.BATCH));
    }
  }));

  srv.on("LogSystemList", ExceptionHandler(async (req) => {

    let oLoggingData = await SELECT.one('SCI_MST0020').where({ ID: req.data.ID });
    oLoggingData.MST0020_ID = req.data.ID;
    oLoggingData.ID = uuidv4();
    await INSERT.into('SCI_MST0020_HIST').entries(oLoggingData);
  }));

  srv.on("LogCodeList", ExceptionHandler(async (req) => {

    let oLoggingData = await SELECT.one('SCI_MST0010').where({ ID: req.data.ID });
    oLoggingData.MST0010_ID = req.data.ID;
    oLoggingData.ID = uuidv4();
    await INSERT.into('SCI_MST0010_HIST').entries(oLoggingData);
  }));

  srv.on("LogInterfaceList", ExceptionHandler(async (req) => {

    let oLoggingData = await SELECT.one('SCI_TP0010').where({ ID: req.data.ID });
    oLoggingData.TP0010_ID = req.data.ID;
    oLoggingData.ID = uuidv4();
    delete oLoggingData.BATCH;
    await INSERT.into('SCI_TP0010_HIST').entries(oLoggingData);
  }));

  srv.on("LogBatchList", ExceptionHandler(async (req) => {

    let oLoggingData = req.data;
    _.forEach(oLoggingData, (oData) => {
      oData.TP0020_ID = oData.ID;
      oData.ID = uuidv4();
    })
    await INSERT.into('SCI_TP0020_HIST').entries(oLoggingData);
  }));

  function ExceptionHandler(handler) {
    return async (data, req) => {
      try {
        await handler(data, req);
      } catch (error) {
        console.error(objectPath.get(error, 'details', objectPath.get(error, 'message', 'Unknown Error!')));
        throw ({
          code: 500,
          message: JSON.stringify(objectPath.get(error, 'message', 'Unknown Error!')),
          target: 'unkonwn'
        });
      }
    };
  }

  srv.after("READ", "SCI_VH_SYSTEMLIST_SRV", (each) => {
    let sCOMPANY_NM = '';
    let sSUBSIDARY_NM = '';
    let sSYSTEM_NM = '';
    let sAPPL_NM = '';
    let sAPPPLTYPE_NM = '';

    if(!bf.IsNotValid(each.COMPANY_NM)){
      sCOMPANY_NM = each.COMPANY_NM
    }
    if(!bf.IsNotValid(each.SUBSIDARY_NM)){
      sSUBSIDARY_NM = each.SUBSIDARY_NM
    }
    if(!bf.IsNotValid(each.SYSTEM_NM)){
      sSYSTEM_NM = each.SYSTEM_NM
    }
    if(!bf.IsNotValid(each.APPL_NM)){
      sAPPL_NM = each.APPL_NM
    }
    if(!bf.IsNotValid(each.APPPLTYPE_NM)){
      sAPPPLTYPE_NM = each.APPPLTYPE_NM
    }

    each.DESC = `${sCOMPANY_NM} ${sSUBSIDARY_NM} ${sSYSTEM_NM} ${sAPPL_NM} ${sAPPPLTYPE_NM}`;
  });


  srv.on("sendErrorEmail", ExceptionHandler((req, next) => {
    sendErrorEmail(req, `File Aleready Exist - ${req.data.fileName}`, sOriginalData);
  }));

  const sendErrorEmail = async (req, soApiMessage, sOriginalData) => {

    // ▶ Mail Setting

    // ▶ Mail Template
    let email = new Email({
      views: {
        root: path.join(__dirname, './email')
      }
    });

    let sSubject = await email.render('subject', {
      type: sType,
      why: sWhy,
      sfileName: req.data.fileName
    });

    let sHtml = await email.render('html', {
      type: sType,
      why: sWhy,
      sfileName: req.data.fileName,
      date: moment().format('MM.DD.YYYY HH:mm:ss'),
      originfile: req.data.fileName,
      errorlogfile: `${sWhy}Log_${req.data.fileName}`
    });

    // ▶ Body Parsing
    let oApiMessage = {};
    let sBody = '';

    let bAPIMessageJSON = isJson(soApiMessage);

    if (bAPIMessageJSON) {
      oApiMessage = JSON.parse(soApiMessage);
      sBody = objectPath.get(oApiMessage, 'body');

      if (sBody) {
        let oBody = JSON.parse(sBody);
        oApiMessage.body = oBody;
      }
    } else {
      oApiMessage.exception = soApiMessage
    }

    let sApiMessage = toXML.parse("APILog", oApiMessage)

    let aAttFile = [{
      filename: req.data.fileName,
      content: sOriginalData,
      contentType: 'text/xml'
    }, {
      filename: `ErrorLog_${req.data.fileName}`,
      content: new Buffer(sApiMessage, 'utf-8'),
      contentType: 'text/xml'
    }]

    sendingEmail(req, 'ERP@sksiltron.com', sRecipient, sReferrer, sSubject, null, sHtml, aAttFile);
  }


  async function sendingEmail(req, sFrom, sTo, sCC, sSubject, sText, sHtml, aAttFile) {

    // Mail Send
    const oEmailConfig = await utils.getSiltronEmail(req);

    if (req.errors) {
      return;
    }

    try {
      let transporter = nodemailer.createTransport({
        host: oEmailConfig.host,
        port: oEmailConfig.port,
        secure: false,
        auth: {
          user: oEmailConfig.user,
          pass: oEmailConfig.pass
        }
      });

      let info = await transporter.sendMail({
        from: sFrom,
        to: sTo,
        cc: sCC,
        subject: sSubject,
        text: sText,
        html: sHtml,
        attachments: aAttFile
      });

    } catch (oError) {
      req.error(500, {
        message: `Send Email Error - ${oError}`,
        target: 'Send Email'
      });
    }
  }
});
