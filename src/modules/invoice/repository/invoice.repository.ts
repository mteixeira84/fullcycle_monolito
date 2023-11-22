import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items.entity";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(entity: Invoice): Promise<Invoice> {
    const result: InvoiceModel = await InvoiceModel.create(
      {
        id: entity.id.id,
        name: entity.name,
        document: entity.document,
        street: entity.address.street,
        number: entity.address.number,
        complement: entity.address.complement,
        city: entity.address.city,
        state: entity.address.state,
        zipCode: entity.address.zipCode,
        items: entity.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
          };
        }),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
      {
        include: [InvoiceItemsModel],
      }
    );

    return new Invoice({
      id: new Id(result.id),
      name: result.name,
      document: result.document,
      address: new Address(
        result.street,
        result.number,
        result.complement,
        result.city,
        result.state,
        result.zipCode
      ),
      items: result.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemsModel],
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoice.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
}
