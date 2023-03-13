package com.MyStuff.Version.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import at.favre.lib.idmask.ByteToTextEncoding;
import at.favre.lib.idmask.Config;
import at.favre.lib.idmask.IdMask;
import at.favre.lib.idmask.IdMasks;

@MappedSuperclass
public abstract class IdEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public void setId(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }

    static final String KEY = "827398234601ASFDASFLDKASFÖDFÄ#R#24834223842394872349";

    public static String encrypt(long strClearText) {
        final IdMask<Long> idMask = IdMasks.forLongIds(
                Config.builder(KEY.getBytes())
                        .highSecurityMode(true)
                        .encoding(new ByteToTextEncoding.Base32Rfc4648())
                        .build());
        return idMask.mask(strClearText);
    }

    public static Long decrypt(String encrypted) {
        if (encrypted == null) {
            return 0L;
        }
        final IdMask<Long> idMask = IdMasks.forLongIds(
                Config.builder(KEY.getBytes())
                        .highSecurityMode(true)
                        .encoding(new ByteToTextEncoding.Base32Rfc4648())
                        .build());
        return idMask.unmask(encrypted);
    }
}
