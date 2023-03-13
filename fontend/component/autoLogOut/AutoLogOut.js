import React, { useEffect, useState } from 'react';
import IdleTimer from './IdleTimer';
import swal from 'sweetalert';
import { useTranslation } from 'react-i18next';

export default function AutoLogOut() {
  const [isTimeout, setIsTimeout] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 1000, //seconds
      onTimeout: () => {
        setIsTimeout(true);
        swal({
          title: `${t('autoLogOut.please')}`,
          text: `${t('autoLogOut.inactive')}`,
          type: 'error',
          icon: 'error',
        }).then(function () {
          window.location.reload();
        });
      },

      onExpired: () => {
        //do something if expired on load
        setIsTimeout(true);
      },
      onDestroy: () => {},
    });

    return () => {
      if (isTimeout) {
        timer.cleanUp();
      }
    };
  }, [t, isTimeout]);

  return <div>{isTimeout ? '' : ''}</div>;
}
