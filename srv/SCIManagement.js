const cds = require("@sap/cds");
const SequenceHelper = require("./lib/SequenceHelper");
const nodemailer = require("nodemailer");
const Email = require('email-templates');
const objectPath = require('object-path');
const _ = require('lodash');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async (srv) => {

  srv.after("CREATE", "SCI_MST_SYSTEMLIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogSystemList", _.cloneDeep(data));

  }));

  srv.after("UPDATE", "SCI_MST_SYSTEMLIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogSystemList", _.cloneDeep(data));

  }));

  srv.after("CREATE", "SCI_MST_CODE_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogCodeList", _.cloneDeep(data));
  }));

  srv.after("UPDATE", "SCI_MST_CODE_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogCodeList", _.cloneDeep(data));

  }));

  srv.before("CREATE", "SCI_TP_INTERFACELIST_SRV", ExceptionHandler(async (req) => {
    const cInterfaceID = new SequenceHelper({
      db: cds.db,
      sequence: "INTERFACE_ID",
      table: "SCI_TP0010",
      field: "IF_NO"
    });
    req.data.IF_NO = await cInterfaceID.getNextNumber();

  }));

  srv.after("CREATE", "SCI_TP_INTERFACELIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogInterfaceList", _.cloneDeep(data));
    if (data.BATCH.length > 0) {
      tx.emit("LogBatchList", _.cloneDeep(data.BATCH));
    }

  }));

  srv.after("UPDATE", "SCI_TP_INTERFACELIST_SRV", ExceptionHandler((data, req) => {
    const tx = srv.transaction(req);
    tx.emit("LogInterfaceList", _.cloneDeep(data));
    if (data.BATCH.length > 0) {
      tx.emit("ChangeExistBatchFlag", _.cloneDeep(data));
      tx.emit("LogBatchList", _.cloneDeep(data.BATCH));
    }

  }));

  srv.on("LogSystemList", ExceptionHandler(async (req) => {

    let oLoggingData = req.data;
    oLoggingData.MST0020_ID = req.data.ID;
    oLoggingData.ID = uuidv4();
    await INSERT.into('SCI_MST0020_HIST').entries(oLoggingData);

  }));

  srv.on("LogCodeList", ExceptionHandler(async (req) => {

    let oLoggingData = req.data;
    oLoggingData.MST0010_ID = req.data.ID;
    oLoggingData.ID = uuidv4();
    await INSERT.into('SCI_MST0010_HIST').entries(oLoggingData);
  }));

  srv.on("LogInterfaceList", ExceptionHandler(async (req) => {

    let oLoggingData = await SELECT.one('SCI_TP0010').where({ Id: req.data.ID });
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

  srv.on("ChangeExistBatchFlag", ExceptionHandler(async (req) => {

    let oLoggingData = await SELECT.from('SCI_TP0020').where({ TP0010_ID: req.data.ID });

    _.forEach(oLoggingData, (oData) => {
      oData.DELETED_TF = true;
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
