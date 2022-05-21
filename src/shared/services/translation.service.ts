import { Injectable } from '@nestjs/common';
import type { ITranslationDecoratorInterface } from 'interfaces';
import { isArray, isString, map } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import type { translateOptions } from 'nestjs-i18n/dist/services/i18n.service';

import { AbstractDto } from '../../common/dto/abstract.dto';
import { TRANSLATION_DECORATOR_KEY } from '../../decorators';
import { ContextProvider } from '../../providers';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  async translate(
    key: string,
    options: translateOptions = {},
  ): Promise<string> {
    return this.i18n.translate(key, options);
  }

  async translateNecessaryKeys<T extends AbstractDto>(dto: T): Promise<T> {
    await Promise.all(
      map(dto, async (value, key) => {
        if (isString(value)) {
          const translateDec: ITranslationDecoratorInterface =
            Reflect.getMetadata(TRANSLATION_DECORATOR_KEY, dto, key);
          const tmpkey = translateDec?.translationKey ?? value;
          const response = await this.translate(tmpkey, {
            lang: ContextProvider.getLanguage(),
          });
          dto[key] = response;

          return dto;
        }

        if (value instanceof AbstractDto) {
          await this.translateNecessaryKeys(value);

          return;
        }

        if (isArray(value)) {
          await Promise.all(
            map(value, (v) => {
              if (v instanceof AbstractDto) {
                return this.translateNecessaryKeys(v);
              }
            }),
          );
        }
      }),
    );

    return dto;
  }
}
