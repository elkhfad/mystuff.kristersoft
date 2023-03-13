import React from 'react';
import { Button } from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import ItemsPdf from './ItemsPdf';
import Tooltip from '@material-ui/core/Tooltip';
import PrintIcon from '@material-ui/icons/Print';
import { withTranslation } from 'react-i18next';

class PdfToPrints extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <div className="container">
          <ReactToPrint
            trigger={() => (
              <Tooltip title={<div className="toolpin"> {t('general.print')}</div>} placement="top">
                <Button outline="true">
                  <PrintIcon> </PrintIcon>
                </Button>
              </Tooltip>
            )}
            content={() => this.componentRef}
          />
        </div>
        <div className="pdfListStylePrint">
          <ItemsPdf childRef={(el) => (this.componentRef = el)} />
        </div>
      </div>
    );
  }
}
export default withTranslation()(PdfToPrints);
