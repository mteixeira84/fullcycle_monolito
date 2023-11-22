import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceItems from "../domain/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";

const invoiceProps = new Invoice({
  id: new Id("123"),
  name: "Client 1",
  document: "Document 1",
  address: new Address(
    "Street 1",
    "Number 1",
    "Complement 1",
    "City 1",
    "State 1",
    "Zip Code 1"
  ),
  items: [
    new InvoiceItems({
      id: new Id("1"),
      name: "Product 1",
      price: 100,
    }),
    new InvoiceItems({
      id: new Id("2"),
      name: "Product 2",
      price: 200,
    }),
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("Invoice repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should create a invoice", async () => {
    const repository = new InvoiceRepository();
    await repository.generate(invoiceProps);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: [InvoiceItemsModel],
    });

    expect(invoiceProps.id.id).toEqual(invoiceDb.id);
    expect(invoiceProps.name).toEqual(invoiceDb.name);
    expect(invoiceProps.document).toEqual(invoiceDb.document);
    expect(invoiceProps.address.street).toEqual(invoiceDb.street);
    expect(invoiceProps.address.number).toEqual(invoiceDb.number);
    expect(invoiceProps.address.complement).toEqual(invoiceDb.complement);
    expect(invoiceProps.address.city).toEqual(invoiceDb.city);
    expect(invoiceProps.address.state).toEqual(invoiceDb.state);
    expect(invoiceProps.address.zipCode).toEqual(invoiceDb.zipCode);
    expect(invoiceProps.createdAt).toStrictEqual(invoiceDb.createdAt);
    expect(invoiceProps.updatedAt).toStrictEqual(invoiceDb.updatedAt);
    expect(invoiceProps.items.length).toEqual(invoiceDb.items.length);
  });

  it("Should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoiceProps);

    const result = await invoiceRepository.find("123");

    expect(result.id.id).toEqual("123");
    expect(result.name).toEqual("Client 1");
    expect(result.document).toEqual("Document 1");
    expect(result.address.street).toEqual("Street 1");
    expect(result.address.number).toEqual("Number 1");
    expect(result.address.complement).toEqual("Complement 1");
    expect(result.address.city).toEqual("City 1");
    expect(result.address.state).toEqual("State 1");
    expect(result.address.zipCode).toEqual("Zip Code 1");
    expect(result.items.length).toEqual(2);
  });
});
