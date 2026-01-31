#!/usr/bin/env node

/**
 * Скрипт для генерации OpenAPI схемы API на основе контроллера UserController
 * 
 * Использование: node scripts/generate-api-schema.js [output-file]
 * По умолчанию создается файл api-schema.json в корне проекта
 */

const fs = require('fs');
const path = require('path');

// Конфигурация API
const API_CONFIG = {
  title: 'Device Monitoring API',
  version: '1.0.0',
  description: 'API для мониторинга устройств и сессий пользователей',
  baseUrl: 'https://localhost:8080',
  basePath: '/User'
};

// Генерация OpenAPI схемы
function generateOpenAPISchema() {
  const schema = {
    openapi: '3.0.0',
    info: {
      title: API_CONFIG.title,
      version: API_CONFIG.version,
      description: API_CONFIG.description,
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: API_CONFIG.baseUrl,
        description: 'Development server'
      }
    ],
    paths: {
      [API_CONFIG.basePath]: {
        get: {
          summary: 'Получить список всех пользователей/устройств',
          description: 'Возвращает список всех записей о пользователях и их сессиях',
          operationId: 'getAllUsers',
          tags: ['Users'],
          responses: {
            '200': {
              description: 'Успешный ответ',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/UserResponse'
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Внутренняя ошибка сервера'
            }
          }
        },
        post: {
          summary: 'Создать новую запись о сессии пользователя',
          description: 'Создает новую запись о сессии пользователя с указанными данными',
          operationId: 'createUser',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserRequest'
                },
                example: {
                  name: 'Chrome on Windows',
                  startTime: '2024-01-01T10:00:00.000Z',
                  endTime: '2024-01-01T11:30:00.000Z',
                  version: '120.0.0.0'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Успешное создание',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Идентификатор созданной записи'
                  },
                  example: 'f695ea23-8662-4a57-975a-f5afd26655db'
                  }
                }
              },
            '400': {
              description: 'Неверный запрос (ошибка валидации)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        description: 'Описание ошибки'
                      }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Внутренняя ошибка сервера'
            }
          }
        }
      },
      [`${API_CONFIG.basePath}/{id}`]: {
        put: {
          summary: 'Обновить запись о сессии пользователя',
          description: 'Обновляет существующую запись о сессии пользователя по идентификатору',
          operationId: 'updateUser',
          tags: ['Users'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Идентификатор записи',
              schema: {
                type: 'string',
                format: 'uuid'
              },
              example: 'f695ea23-8662-4a57-975a-f5afd26655db'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserRequest'
                },
                example: {
                  name: 'Chrome on Windows',
                  startTime: '2024-01-01T10:00:00.000Z',
                  endTime: '2024-01-01T11:30:00.000Z',
                  version: '120.0.0.0'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Успешное обновление',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Идентификатор обновленной записи'
                  }
                }
              }
            },
            '404': {
              description: 'Запись не найдена'
            },
            '500': {
              description: 'Внутренняя ошибка сервера'
            }
          }
        },
        delete: {
          summary: 'Удалить запись о сессии пользователя',
          description: 'Удаляет запись о сессии пользователя по идентификатору',
          operationId: 'deleteUser',
          tags: ['Users'],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Идентификатор записи',
              schema: {
                type: 'string',
                format: 'uuid'
              },
              example: 'f695ea23-8662-4a57-975a-f5afd26655db'
            }
          ],
          responses: {
            '200': {
              description: 'Успешное удаление',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Идентификатор удаленной записи'
                  }
                }
              }
            },
            '404': {
              description: 'Запись не найдена'
            },
            '500': {
              description: 'Внутренняя ошибка сервера'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        UserRequest: {
          type: 'object',
          required: ['name', 'startTime', 'endTime', 'version'],
          properties: {
            name: {
              type: 'string',
              description: 'Имя пользователя или идентификатор устройства',
              example: 'Chrome on Windows'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Время начала сессии в формате ISO 8601',
              example: '2024-01-01T10:00:00.000Z'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'Время окончания сессии в формате ISO 8601',
              example: '2024-01-01T11:30:00.000Z'
            },
            version: {
              type: 'string',
              description: 'Версия браузера или приложения',
              example: '120.0.0.0'
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Уникальный идентификатор записи',
              example: 'f695ea23-8662-4a57-975a-f5afd26655db'
            },
            name: {
              type: 'string',
              description: 'Имя пользователя или идентификатор устройства',
              example: 'Chrome on Windows'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Время начала сессии в формате ISO 8601',
              example: '2024-01-01T10:00:00.000Z'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'Время окончания сессии в формате ISO 8601',
              example: '2024-01-01T11:30:00.000Z'
            },
            version: {
              type: 'string',
              description: 'Версия браузера или приложения',
              example: '120.0.0.0'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Users',
        description: 'Операции с пользователями и сессиями устройств'
      }
    ]
  };

  return schema;
}

// Главная функция
function main() {
  const outputFile = process.argv[2] || path.join(__dirname, '..', '..', 'api-schema.json');
  const schema = generateOpenAPISchema();
  
  // Создаем директорию, если её нет
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Записываем схему в файл
  fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2), 'utf8');
  
  console.log(`✅ OpenAPI схема успешно сгенерирована: ${outputFile}`);
  console.log(`📄 Схема содержит ${Object.keys(schema.paths).length} endpoint(s)`);
  console.log(`🔧 Для просмотра схемы используйте Swagger UI или другие инструменты`);
}

// Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { generateOpenAPISchema };
